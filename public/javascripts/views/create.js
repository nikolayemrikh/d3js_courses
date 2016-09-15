/*
    global Backbone, app, _, $
*/
define([
    "i18n",
    "text!templates/create.html",
    "models/taskModel",
    "models/courseModel"
], function(i18n, template, TaskModel, CourseModel) {
    console.log('views/create.js');
    var View = Backbone.View.extend({
        className: "createPopup",
        events: {
            "submit #create-task-form": "send"
        },
        initialize: function(options) {
            // Variables
            var self = this;
            this.historyFlag = false;
            this.options = options || {};
            // Templates
            this.templates = _.parseTemplate(template);
        },
        render: function(args) {
            var self = this;
            if (args.collectionName == "task") {
                this.collectionName = "task";
                this.courseId = args.courseId;
            }
            else {
                this.collectionName = "course";
            }
            this.collection = args.collection;
            this.Model = args.Model;
            var data = {
                i18n: i18n,
                collectionName: this.collectionName
            };
            var tpl = _.template(this.templates['main-tpl']);
            this.$el.html(tpl(data));

            return this;
        },
        destroy: function() {
            this.remove();
        },
        send: function(event) {
            var self = this;
            event.preventDefault();
            var form = this.el.querySelector("#create-task-form");
            var newObj;
            newObj = new this.Model();
            if (this.collectionName == "task") {
                newObj.set({
                    isChallenge: form.elements.is_challenge.value == "challenge" ? true : false,
                    taskName: form.elements.task_title.value,
                    taskDescription: form.elements.task_description.value,
                    courseId: this.courseId,
                    //Временно зададим номер, потому что нельзя послать в бекбоне модель с айди..
                    number: Number.parseInt(form.elements.task_number_in_course.value)
                });
            } else if (this.collectionName == "course") {
                newObj.set({
                    name: form.elements.course_name.value,
                    number: Number.parseInt(form.elements.course_number.value),
                    description: form.elements.course_description.value
                });
            }
            newObj.save(null, {
                success: function(model, response, options) {
                    self.options.closeDialog(self.collectionName, model);
                },
                error: function(model, xhr, options) {
                    console.log("Не сохранено", model, xhr, options);
                    form.querySelector(".form-number").classList.toggle("has-error");
                }
            });
        }
    });
    return View;
});