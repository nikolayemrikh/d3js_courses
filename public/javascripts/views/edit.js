/*
    global Backbone, app, _, $
*/
define([
    "i18n",
    "text!templates/edit.html",
    "models/taskModel",
    "models/courseModel"
], function(i18n, template, TaskModel, CourseModel) {
    console.log('views/edit.js');
    var View = Backbone.View.extend({
        className: "editTask",
        events: {
            "click .btn-prev": "goToStart",
            "submit #edit-model-form": "send",
            "click .msg-close": "msgClose"
        },
        initialize: function(options) {
            // Variables
            var self = this;
            this.historyFlag = false;
            this.options = options || {};
            // Templates
            this.templates = _.parseTemplate(template);
            if (this.options.taskId) {
                this.collectionName = "task";
                this.modelId = this.options.taskId;
                this.Model = Backbone.Model.extend({
                    urlRoot: "/course/" + this.options.courseId + "/task/",
                    idAttribute: "taskId"
                });
                this.model = new this.Model({
                    taskId: this.options.taskId
                });
            }
            else {
                this.collectionName = "course";
                this.modelId = this.options.courseId;
                this.Model = Backbone.Model.extend({
                    urlRoot: "/course/",
                    idAttribute: "courseId"
                });
                this.model = new this.Model({
                    courseId: this.options.courseId
                });
            }
        },
        render: function() {
            var self = this;
            this.model.fetch({
                success: function(model, response, options) {
                    console.log(model, response, options)
                    var data = {
                        i18n: i18n,
                        collectionName: self.collectionName,
                        modelAttributes: model.attributes
                    };
                    var tpl = _.template(self.templates['main-tpl']);
                    self.$el.html(tpl(data));
                }
            });
            return this;
        },
        destroy: function() {
            this.remove();
        },
        goToStart: function(event) {
            event.preventDefault();
            event.stopPropagation();
            if (this.collectionName === "course") {
                app.router.navigate("start", {
                    trigger: true
                });
            }
            else if (this.collectionName === "task") {
                app.router.navigate("start/" + this.options.courseId, {
                    trigger: true
                });
            }
        },
        send: function(event) {
            var self = this;
            event.preventDefault();
            event.stopPropagation();
            var form = this.el.querySelector("#edit-model-form");
            if (this.collectionName == "task") {
                this.model = new TaskModel({
                    _id: self.model.attributes._id,
                    courseId: self.model.attributes.courseId
                });
                this.model.set({
                    taskId: Number.parseInt(form.elements.task_number_in_course.value),
                    isChallange: form.elements.task_is_challenge.value == "challenge" ? true : false,
                    taskName: form.elements.task_title.value,
                    taskDescription: form.elements.task_description.value,
                    taskInfo: form.elements.task_info.value,
                    goals: form.elements.task_goals.value,
                    jsSolution: form.elements.task_js_check.value,
                    htmlSolution: form.elements.task_html_solution ? form.elements.task_html_solution.value : null,
                    jsBlocked: form.elements.task_js_block.checked,
                    htmlBlocked: form.elements.task_html_block.checked,
                    cssBlocked: form.elements.task_css_block.checked,
                    initialJs: form.elements.task_initial_js.value,
                    initialHtml: form.elements.task_initial_html.value,
                    initialCss: form.elements.task_initial_css.value
                });
            }
            else if (this.collectionName == "course") {
                this.model = new CourseModel({
                    _id: self.model.attributes._id
                });
                this.model.set({
                    courseId: Number.parseInt(form.elements.course_number.value),
                    name: form.elements.course_name.value,
                    description: form.elements.course_description.value
                });
            }
            console.log(this.model)
            this.model.save(null, {
                success: function(model, response, options) {
                    
                },
                error: function(model, xhr, options) {
                    console.log("Не сохранено", model, xhr, options);
                    var alert = self.el.querySelector(".alert-msg");
                    console.log(alert)
                    alert.querySelector(".msg").innerText = xhr.responseText;
                    alert.hidden = false;
                }
            });
        },
        msgClose: function(event) {
            var alert = this.el.querySelector(".alert-msg");
            alert.querySelector(".msg").innerText = "";
            alert.hidden = true;
        }
    });
    return View;
});