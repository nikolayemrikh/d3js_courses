/*  global Backbone, app, _, BootstrapDialog
 */
define([
    "i18n",
    "text!templates/start.html",
    "views/create",
    "views/edit",
    "collections/tasks",
    "collections/courses",
    "models/taskModel",
    "models/courseModel"
], function(i18n, template, createView, editView, TasksCollection, CoursesCollection, TaskModel, CourseModel) {
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
                collectionName = "task";
                completedItems = this.options.profile.get("completedTasks");
            }
            console.log(completedItems)
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
                    this.model.idAttribute = "taskId";
                },
                render: function() {
                    console.log(this.model)
                    this.number = this.model.attributes.number;
                    var data;
                    if (collectionName === "course") {
                        data = {
                            //_id: this.model.attributes._id,
                            item: {
                                courseId: this.model.attributes.courseId,
                                name: this.model.attributes.name,
                                description: this.model.attributes.description
                            }
                        };
                    }
                    else if (collectionName === "task") {
                        data = {
                            item: {
                                taskId: this.model.attributes.taskId,
                                courseId: this.model.attributes.courseId,
                                name: this.model.attributes.taskName,
                                description: this.model.attributes.taskDescription
                            }
                        };
                    }
                    data.completedItems = completedItems;
                    console.log(data)

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
                        app.router.navigate("start/" + this.number, {
                            trigger: true
                        });
                    }
                    else if (collectionName === "task") {
                        app.router.navigate("main/" + this.number, {
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
                        app.router.navigate("edit/course/" + self.options.courseId + "/task/" + model.attributes.taskId, {
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
                                    success: function(model, response, options) {
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
            if (this.collectionName === "task") {
                //Получить курс и задания
                this.courseModel = new CourseModel({
                    courseId: this.options.courseId
                });
                var TaskCollection = Backbone.Collection.extend({
                    url: "/course/" + this.options.courseId + "/task/",
                });
                //this.tasksCollection = new TasksCollection();
                this.tasksCollection = new TaskCollection();
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
                this.coursesCollection = new CoursesCollection();
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
                    courseId: this.options.courseId
                };
            }
            else if (this.collectionName === "course") {
                args = {
                    collectionName: "course"
                };
            }
            self.view.createView.setElement(this.dialog.getModalDialog()).render(args);
            this.dialog.open();
        },
        closeTaskDialog: function() {
            if (this.dialog) {
                this.dialog.close();
                this.dialog = null;
            }
            this.render();
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