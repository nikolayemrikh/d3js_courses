/*  global Backbone, app, _, BootstrapDialog
 */
define([
    "i18n",
    "text!templates/start.html",
    "views/create",
    "views/edit",
], function(i18n, template, createView, editView) {
    console.log('views/start.js');
    var View = Backbone.View.extend({
        events: {
            //"click .start-btn": "start"
            "click .logout-btn": "doLogout",
            "click .btn-create-item": "createItem",
            "click .btn-back": "backToCourses"
        },
        initialize: function(options) {
            var self = this;
            // Variables
            this.historyFlag = false;
            this.options = options || {};
            // Templates
            this.templates = _.parseTemplate(template);
            // Sub views
            this.view = {
                createView: new createView({
                    send: this.sendItem.bind(this),
                    closeDialog: this.closeTaskDialog.bind(this)
                })
            };
            app.profile.fetch();
            var collectionName, completedItems;
            if (!this.options.courseId) {
                collectionName = "course";
                completedItems = this.options.profile.get("completedCourses");
            }
            else {
                this.options.courseId = Number.parseInt(this.options.courseId);
                collectionName = "task";
                completedItems = this.options.profile.get("completedTasks");
            }
            this.completedItems = completedItems;
            this.collectionName = collectionName;
            this.courseView = Backbone.View.extend({
                tagName: "tr",
                events: {
                    "click .start-course-btn": "start",
                    "click .btn-edit-item": "editItem",
                    "click .btn-delete-item": "deleteItem",
                },
                initialize: function() {
                    this.tpl = _.template(self.templates['course-td-tpl']);
                    this.listenTo(this.model, 'change', this.render);
                    this.listenTo(this.model, 'remove', this.remove);
                    this.listenTo(this.model, 'destroy', this.remove);
                    if (collectionName == "task") {
                        this.model.idAttribute = "taskId";
                    }
                    else if (collectionName == "course") {
                        this.model.idAttribute = "courseId";
                    }
                },
                render: function() {
                    this.number = this.model.attributes.number;
                    var data;
                    if (collectionName === "course") {
                        data = {
                            //_id: this.model.attributes._id,
                            item: {
                                _id: this.model.attributes._id,
                                courseId: this.model.attributes.courseId,
                                name: this.model.attributes.name,
                                description: this.model.attributes.description
                            }
                        };
                    }
                    else if (collectionName === "task") {
                        data = {
                            item: {
                                _id: this.model.attributes._id,
                                taskId: this.model.attributes.taskId,
                                courseId: this.model.attributes.courseId,
                                name: this.model.attributes.taskName,
                                description: this.model.attributes.taskDescription
                            }
                        };
                    }
                    data.completedItems = completedItems;

                    this.$el.html(this.tpl(data));
                    if (self.options.role && self.options.role == 3) {
                        this.$(".btn-controls").css("display", "block");
                    }
                    return this;
                },
                start: function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (collectionName === "course") {
                        app.router.navigate("start/" + this.model.attributes.courseId, {
                            trigger: true
                        });
                    }
                    else if (collectionName === "task") {
                        app.router.navigate("main/" + this.model.attributes.taskId, {
                            trigger: true
                        });
                    }
                },
                editItem: function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (!self.options.role || self.options.role != 3) return;

                    var model = this.model;
                    if (collectionName === "course") {
                        app.router.navigate("edit/course/" + model.attributes.courseId, {
                            trigger: true
                        });
                    }
                    else if (collectionName === "task") {
                        app.router.navigate("edit/course/" + model.attributes.courseId + "/task/" + model.attributes.taskId, {
                            trigger: true
                        });
                    }
                },
                deleteItem: function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (!self.options.role || self.options.role != 3) return;
                    var model = this.model;
                    this.dialog = new BootstrapDialog({
                        draggable: true,
                        title: "Удаление",
                        message: "Подтвердите удаление",
                        buttons: [{
                            label: "Удалить",
                            cssClass: "btn-danger",
                            icon: "glyphicon glyphicon-remove",
                            action: function(dialogItself) {
                                model.destroy({
                                    wait: true,
                                    success: function(model, response, options) {
                                        var completedItems = self.completedItems;
                                        var pos = completedItems.indexOf(model.attributes._id);
                                        if (pos != -1) {
                                            completedItems.splice(pos, 1);
                                            if (self.collectionName === "task") {
                                                self.options.profile.set({completedTasks: completedItems});
                                            } else if (self.collectionName === "course") {
                                                self.options.profile.set({completedCourses: completedItems});
                                            }
                                            self.options.profile.save();
                                        }
                                        dialogItself.close();
                                    },
                                    error: function(model, xhr, options) {
                                        console.log("Не сохранено", model, xhr, options);
                                    }
                                });
                            }
                        }, {
                            label: 'Закрыть',
                            action: function(dialogItself) {
                                dialogItself.close();
                            }
                        }]
                    });
                    this.dialog.realize();
                    this.dialog.open();
                },
            });
        },
        render: function() {
            var self = this;
            this.tasksCollection = null;
            this.courseModel = null;
            this.coursesCollection = null;
            var tpl = _.template(this.templates['main-tpl']);
            var data = {
                i18n: i18n,
                collectionName: this.collectionName,
                courseId: this.options.courseId
            };
            this.$el.html(tpl(data));
            if (this.options.role == 3) {
                this.$(".btn-create-item").css("display", "block");
            }
            this.CourseModel = Backbone.Model.extend({
                constructor: function() {
                    Backbone.Model.apply(this, arguments);
                },
                urlRoot: "/course/",
                idAttribute: "courseId"
            });
            if (this.collectionName === "task") {
                //Получить курс и задания
                this.courseModel = new this.CourseModel({
                    courseId: this.options.courseId
                });
                this.TaskModel = Backbone.Model.extend({
                    constructor: function() {
                        Backbone.Model.apply(this, arguments);
                    },
                    urlRoot: "/course/" + this.options.courseId + "/task/",
                    idAttribute: "taskId"
                });
                this.TaskCollection = Backbone.Collection.extend({
                    url: "/course/" + this.options.courseId + "/task/",
                    model: this.TaskModel
                });
                //this.tasksCollection = new TasksCollection();
                this.tasksCollection = new this.TaskCollection();
                this.listenTo(this.tasksCollection, 'add', this.appendCourse);
                this.courseModel.fetch({
                    success: function(model, response, options) {
                        var tasks = model.attributes.tasks;
                        self.tasksCollection.add(tasks);
                    }
                });
                // Получить только задания курса
                /*var TaskCollection = Backbone.Collection.extend({
                    url: "/course/" + this.options.courseId + "/task/",
                });
                this.tasksCollection = new TaskCollection();
                this.listenTo(this.tasksCollection, 'add', this.appendCourse);
                self.tasksCollection.fetch();*/
            }
            else if (this.collectionName === "course") {
                this.CoursesCollection = Backbone.Collection.extend({
                    url: "/course/",
                    model: this.CourseModel
                });
                this.coursesCollection = new this.CoursesCollection();
                this.listenTo(this.coursesCollection, 'add', this.appendCourse);
                this.coursesCollection.fetch();
            }

            this.$outputCoursesBody = this.$(".courses-body");
            return this;
        },
        destroy: function() {
            for (var v in this.view) {
                if (this.view[v]) this.view[v].destroy();
            }
            this.tasksCollection = null;
            this.courseModel = null;
            this.coursesCollection = null;
            this.remove();
        },
        appendCourse: function(courseModel) {
            var self = this;
            var view = new this.courseView({
                model: courseModel
            });
            this.$outputCoursesBody.append(view.render().el);
            //this.firstModelAt++;
        },
        doLogout: function(event) {
            event.preventDefault();
            app.logout();
        },
        createItem: function(event) {
            var self = this;
            event.preventDefault();
            event.stopPropagation();
            if (!this.options.role || this.options.role != 3) return;

            this.dialog = new BootstrapDialog({
                draggable: true
            });
            this.dialog.realize();
            var args;
            if (this.collectionName === "task") {
                args = {
                    collectionName: "task",
                    courseId: this.options.courseId,
                    collection: this.tasksCollection,
                    Model: this.TaskModel
                };
            }
            else if (this.collectionName === "course") {
                args = {
                    collectionName: "course",
                    collection: this.coursesCollection,
                    Model: this.CourseModel
                };
            }
            self.view.createView.setElement(this.dialog.getModalDialog()).render(args);
            this.dialog.open();
        },
        sendItem: function(collectionName, model) {
            var self = this;
            if (collectionName === "task") {
                model = new this.TaskModel(model);
            }
            else if (collectionName === "course") {
                model = new this.CourseModel(model);
            }
            model.save(null, {
                success: function(model, response, options) {
                    if (collectionName === "task") {
                        self.tasksCollection.push(model);
                    }
                    else if (collectionName === "course") {
                        self.coursesCollection.push(model);
                    }
                    self.closeTaskDialog();
                },
                error: function(model, xhr, options) {
                    console.log("Не сохранено", model, xhr, options);
                }
            });
        },
        closeTaskDialog: function(collectionName, model) {
            if (collectionName === "task") {
                this.tasksCollection.push(model);
            }
            else if (collectionName === "course") {
                this.coursesCollection.push(model);
            }
            if (this.dialog) {
                this.dialog.close();
                this.dialog = null;
            }
            //this.render();
        },
        backToCourses: function(event) {
            event.preventDefault();
            event.stopPropagation();
            app.router.navigate("start/", {
                trigger: true
            });
        }
    });
    return View;
});