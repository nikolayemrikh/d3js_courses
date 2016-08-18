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
            "click .btn-prev": "goToStart"
        },
        initialize: function(options) {
            // Variables
            var self = this;
            this.historyFlag = false;
            this.options = options || {};
            // Templates
            this.templates = _.parseTemplate(template);
            this.courseNumber = this.options.courseNumber;
            this.taskNumber = this.options.taskNumber;
            if (this.taskNumber) {
                this.collectionName = "task";
                this.Model = TaskModel;
                this.modelNumber = this.taskNumber;
            }
            else {
                this.collectionName = "course";
                this.Model = CourseModel;
                this.modelNumber = this.courseNumber;
            }
            this.model = new this.Model({
                _id: this.modelNumber
            });
        },
        render: function() {
            var self = this;
            this.model.fetch({
                success: function(model, response, options) {
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
                app.router.navigate("start/" + this.number, {
                    trigger: true
                });
            }
        }
    });
    return View;
});