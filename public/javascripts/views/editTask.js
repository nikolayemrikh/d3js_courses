/*
    global Backbone, app, _, $
*/
define([
    "i18n",
    "text!templates/editTask.html",
    "models/taskModel",
    "models/courseModel"
], function(i18n, template, TaskModel, CourseModel) {
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
            this.collectionName = options.collectionName;
            this.modelNumber = options.page;
            if (this.collectionName === "course") {
                this.Model = CourseModel;
            } else if (this.collectionName === "task") {
                this.Model = TaskModel;
            }
            this.model = new this.Model({
                number: this.modelNumber
            });
        },
        render: function() {
            var self = this;
            this.model.fetch();
            console.log(this.model);
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