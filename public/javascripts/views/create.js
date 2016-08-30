/*
    global Backbone, app, _, $
*/
define([
    "i18n",
    "text!templates/create.html",
    "models/taskModel"
], function(i18n, template, TaskModel) {
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
        render: function(courseNumber, tasksCollection, courseModel) {
            var self = this;
            var collectionName;
            if (courseNumber) {
                this.courseNumber = courseNumber;
                this.tasksCollection = tasksCollection;
                this.courseModel = courseModel;
                collectionName = "task";
            } else {
                collectionName = "course";
            }
            var data = {
                i18n: i18n
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
            var newObj = new TaskModel();
            console.log(this.courseModel)
            newObj.set({
                isChallange: form.elements.is_challenge.value == 1 ? true : false,
                taskName: form.elements.task_title.value,
                number: Number.parseInt(form.elements.task_number_in_course.value),
                courseId: this.courseModel.attributes._id
            });
            if (this.tasksCollection.findWhere({number: newObj.attributes.number})) {
                form.querySelector(".form-number").classList.toggle("has-error");
            } else {
                newObj.save(null, {
                    success: function(model, response, options) {
                        console.log(model, response)
                        self.options.closeDialog();
                    }
                });
            }
        }
    });
    return View;
});