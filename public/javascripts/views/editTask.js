/*
    global Backbone, app, _, $
*/
define([
    "i18n",
    "text!templates/editTask.html",
    "models/taskModel"
], function(i18n, template, TaskModel) {
    console.log('views/editTask.js');
    var View = Backbone.View.extend({
        className: "editTask",
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
        }
    });
    return View;
});