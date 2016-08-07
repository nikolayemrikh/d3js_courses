/*
    global Backbone, app, _, $
*/
define([
    "i18n",
    "text!templates/createTask.html",
], function(i18n, template) {
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
        render: function() {
            var self = this;
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
            var newTask = {
                challange: form.elements.is_challenge.value,
                title: form.elements.task_title.value,
                number: form.elements.task_number_in_course.value
            };
            console.log(newTask);
        }
    });
    return View;
});