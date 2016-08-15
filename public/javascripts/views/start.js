/*  global Backbone, app, _, BootstrapDialog
 */
define([
    "i18n",
    "text!templates/start.html",
    "views/createTask",
    "views/editTask",
    "collections/tasks"
], function(i18n, template, createTaskView, editTaskView, TasksCollection) {
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
                createTaskView: new createTaskView({
                    closeDialog: this.closeTaskDialog.bind(this)
                })
            };
            app.profile.fetch();
            if (!this.options.courseNumber) {
                var collectionName = "course";
                var collectionUrl = "/course";
                var completedItems = this.options.profile.get("completedCourses");
            }
            else {
                var collectionName = "task";
                var collectionUrl = "/course";
                var completedItems = this.options.profile.get("completedTasks");
            }
            this.collectionName = collectionName;
            console.log(completedItems)
                /*this.collectionInfo = {
                    collectionName: "course",
                    collectionUrl: "/course",
                    completedItems: this.options.profile.get("completedCourses")
                };*/

            this.Courses = Backbone.Collection.extend({
                url: collectionUrl,
                sort_key: "number", // default sort key
                comparator: function(item) {
                    return item.get(this.sort_key);
                },
                sortByField: function(fieldName) {
                    this.sort_key = fieldName;
                    this.sort();
                }
            });
            //this.courses = new Courses();
            this.firstModelAt = 1;
            //this.listenTo(this.courses, 'add', this.appendCourse);
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
                    console.log(number);
                    app.router.navigate("editTask/" + collectionName + "/" + number, {
                        trigger: true
                    });
                },
            });
        },
        render: function() {
            var self = this;
            this.courses = null;
            this.items = null;
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
            //this.courses.fetch();
            this.courses = new this.Courses();
            
            if (this.collectionName === "task") {
                this.items = new TasksCollection();
            } else if (this.collectionName === "course") {
                this.items = this.courses;
            }
            this.listenTo(this.items, 'add', this.appendCourse);

            this.$outputCoursesBody = this.$(".courses-body");
            self.courses.fetch({
                success: function(collection, response, options) {
                    if (self.collectionName === "task") {
                        var course = collection.findWhere({
                            number: Number.parseInt(self.options.courseNumber)
                        });
                        var tasks = course.attributes.tasks;
                        console.log(tasks)
                        self.items.add(tasks);
                    }
                }
            });

            return this;
        },
        destroy: function() {
            for (var v in this.view) {
                if (this.view[v]) this.view[v].destroy();
            }
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
            self.view.createTaskView.setElement(this.dialog.getModalDialog()).render(this.items);
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