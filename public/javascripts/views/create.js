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
        render: function(obj) {
            var self = this;
            if (obj.collectionName == "task") {
                this.collectionName = "task";
                this.collection = obj.collection;
                this.courseModel = obj.courseModel;
            }
            else {
                this.collectionName = "course";
                this.collection = obj.collection;
            }
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
            if (this.collectionName == "task") {
                newObj = new TaskModel();
                newObj.set({
                    isChallange: form.elements.is_challenge.value == 1 ? true : false,
                    taskName: form.elements.task_title.value,
                    courseId: this.courseModel.attributes.courseId,
                    //Временно зададим номер, потому что нельзя послать в бекбоне модель с айди..
                    number: Number.parseInt(form.elements.task_number_in_course.value)
                });
            }
            else if (this.collectionName == "course") {
                newObj = new CourseModel();
                newObj.set({
                    name: form.elements.course_name.value,
                    number: Number.parseInt(form.elements.course_number.value),
                });
            }
            if (this.collection.findWhere({
                    taskId: newObj.attributes.number
                })) {
                form.querySelector(".form-number").classList.toggle("has-error");
            }
            else {
                newObj.save(null, {
                    success: function(model, response, options) {
                        console.log(model, response)
                        self.options.closeDialog();
                    },
                    error: function(model, xhr, options) {
                        console.log("Не сохранено", model, xhr, options);
                        //self.options.closeDialog();
                    }
                });
            }
        }
    });
    return View;
});