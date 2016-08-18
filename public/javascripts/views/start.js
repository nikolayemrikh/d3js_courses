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
            if (!this.options.courseNumber) {
                collectionName = "course";
                completedItems = this.options.profile.get("completedCourses");
            }
            else {
                collectionName = "task";
                completedItems = this.options.profile.get("completedTasks");
            }
            this.collectionName = collectionName;
            this.courseView = Backbone.View.extend({
                tagName: "tr",
                events: {
                    "click .start-course-btn": "start",
                    "click .btn-edit-item": "editItem",
                },
                initialize: function() {
                    this.tpl = _.template(self.templates['course-td-tpl']);
                    this.listenTo(this.model, 'change', this.render);
                    this.listenTo(this.model, 'remove', this.remove);
                    this.listenTo(this.model, 'destroy', this.remove);
                },
                render: function() {
                    console.log(this.model)
                    this.number = this.model.attributes.number;
                    var data;
                    if (collectionName === "course") {
                        data = {
                            _id: this.model.attributes._id,
                            number: this.model.attributes.number,
                            name: this.model.attributes.name,
                            description: this.model.attributes.description
                        };
                    }
                    else if (collectionName === "task") {
                        data = {
                            _id: this.model.attributes._id,
                            number: this.model.attributes.number,
                            name: this.model.attributes.taskName,
                            description: this.model.attributes.taskDescription
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

                    var number = event.currentTarget.dataset.number;
                    if (collectionName === "course") {
                        app.router.navigate("edit/course/" + number, {
                            trigger: true
                        });
                    }
                    else if (collectionName === "task") {
                        app.router.navigate("edit/course/" + self.options.courseNumber + "/task/" + this.number, {
                            trigger: true
                        });
                    }
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
                courseNumber: this.options.courseNumber
            };
            this.$el.html(tpl(data));
            if (this.options.role == 3) {
                this.$(".btn-create-item").css("display", "block");
            }
            if (this.collectionName === "task") {
                this.courseModel = new CourseModel({
                    _id: this.options.courseNumber
                });
                this.tasksCollection = new TasksCollection();
                this.listenTo(this.tasksCollection, 'add', this.appendCourse);
                this.courseModel.fetch({
                    success: function(model, response, options) {
                        var tasks = model.attributes.tasks;
                        self.tasksCollection.add(tasks);
                    }
                });
            } else if (this.collectionName === "course") {
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
            if (this.collectionName === "task") {
                var courseNumber = this.options.courseNumber;
            }
            self.view.createView.setElement(this.dialog.getModalDialog()).render(courseNumber, this.tasksCollection, this.courseModel);
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