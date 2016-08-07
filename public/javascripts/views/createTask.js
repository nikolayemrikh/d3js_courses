/*
    global Backbone, app, _, $
*/
define([
    "i18n",
    "text!templates/createTask.html",
    "models/taskModel"
], function(i18n, template, TaskModel) {
    console.log('views/createTask.js');
    var View = Backbone.View.extend({
        className: "createTaskPopup",
        events: {
            "submit #create-task-form": "sendTask"
        },
        initialize: function(options) {
            // Variables
            var self = this;
            this.historyFlag = false;
            this.options = options || {};
            // Templates
            this.templates = _.parseTemplate(template);
        },
        render: function(courses) {
            var self = this;
            this.courses = courses;
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
        sendTask: function(event) {
            event.preventDefault();
            var form = this.el.querySelector("#create-task-form");
            var newTask = new TaskModel;
            newTask.set({
                isChallange: form.elements.is_challenge.value == 1 ? true : false,
                taskName: form.elements.task_title.value,
                number: Number.parseInt(form.elements.task_number_in_course.value)
            });
            if (this.courses.findWhere({number: newTask.attributes.number})) {
                form.querySelector(".form-number").classList.toggle("has-error");
            } else {
                newTask.save();
                this.options.closeDialog();
            }
        }
    });
    return View;
});