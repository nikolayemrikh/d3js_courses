/*  global Backbone, app, _, BootstrapDialog
 */
define([
    "i18n",
    "text!templates/start.html",
    "views/createTask",
    "views/editTask",
    "models/taskModel"
], function(i18n, template, createTaskView, editTaskView, TaskModel) {
    console.log('views/start.js');
    var View = Backbone.View.extend({
        events: {
            //"click .start-btn": "start"
            "click .logout-btn": "doLogout",
            "click .btn-create-task": "createTask",
            "click .btn-edit-task": "editTask"
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

            this.Courses = Backbone.Collection.extend({
                model: TaskModel,
                url: "/course",
                sort_key: "number", // default sort key
                comparator: function(item) {
                    return item.get(this.sort_key);
                },
                sortByField: function(fieldName) {
                    this.sort_key = fieldName;
                    this.sort();
                }
            });
            app.profile.fetch();
            //this.courses = new Courses();
            this.firstModelAt = 1;
            //this.listenTo(this.courses, 'add', this.appendCourse);
            this.courseView = Backbone.View.extend({
                tagName: "tr",
                events: {
                    "click .start-course-btn": "start"
                },
                initialize: function() {
                    this.tpl = _.template(self.templates['course-td-tpl']);
                    this.listenTo(this.model, 'change', this.render);
                    this.listenTo(this.model, 'remove', this.remove);
                    this.listenTo(this.model, 'destroy', this.remove);
                },
                render: function(number) {
                    this.number = number;
                    var completedCourses = app.profile.get("completedCourses");
                    var data = {
                        course: this.model.attributes,
                        completedCourses: completedCourses
                    };
                    this.$el.html(this.tpl(data));
                    if (self.options.role == 3) {
                        this.$(".btn-controls").css("display", "block");
                    }
                    return this;
                },
                start: function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    app.router.navigate("main/" + this.number, {
                        trigger: true
                    });
                }
            });
        },
        render: function() {
            var self = this;
            this.courses = null;
            var tpl = _.template(this.templates['main-tpl']);
            var data = {
                i18n: i18n
            };
            this.$el.html(tpl(data));
            if (this.options.role == 3) {
                this.$(".btn-controls").css("display", "block");
            }
            //this.courses.fetch();
            this.courses = new this.Courses();
            this.listenTo(this.courses, 'add', this.appendCourse);

            this.$outputCoursesBody = this.$(".courses-body");
            self.courses.fetch();

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
            this.$outputCoursesBody.append(view.render(this.firstModelAt).el);
            this.firstModelAt++;
        },
        doLogout: function(event) {
            event.preventDefault();
            app.logout();
        },
        createTask: function(event) {
            var self = this;
            event.preventDefault();
            event.stopPropagation();
            if (!this.options.role || this.options.role != 3) return;

            this.dialog = new BootstrapDialog({
                draggable: true
            });
            this.dialog.realize();
            self.view.createTaskView.setElement(this.dialog.getModalDialog()).render(this.courses);
            this.dialog.open();
        },
        editTask: function(event) {
            event.preventDefault();
            event.stopPropagation();
            if (!this.options.role || this.options.role != 3) return;

            var number = event.currentTarget.dataset.number;
            console.log(number);
            app.router.navigate("editTask/" + number, {
                trigger: true
            });
        },
        closeTaskDialog: function() {
            if (this.dialog) {
                this.dialog.close();
                this.dialog = null;
            }
            this.render();
        }
    });
    return View;
});