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
            "submit #edit-model-form": "send"
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
                this.modelNumber = this.courseNumber;
                this.Model = CourseModel
            }
            this.model = new this.Model({
                _id: this.modelNumber
            });
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
                app.router.navigate("start/" + this.courseNumber, {
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
                this.model.set({
                    isChallange: form.elements.is_challenge.value == 1 ? true : false,
                    taskName: form.elements.task_title.value,
                    number: Number.parseInt(form.elements.task_number_in_course.value),
                    courseId: this.courseModel.attributes._id
                });
            }
            else if (this.collectionName == "course") {
                this.model.set({
                    name: form.elements.course_name.value,
                    number: Number.parseInt(form.elements.course_number.value),
                });
            }
            /*if (this.collection.findWhere({
                    number: newObj.attributes.number
                })) {
                form.querySelector(".form-number").classList.toggle("has-error");
            }*/
            this.model.save(null, {
                success: function(model, response, options) {
                    console.log(model, response)
                },
                error: function(model, xhr, options) {
                    console.log("Не сохранено", model, xhr, options);
                    //self.options.closeDialog();
                }
            });
        }
    });
    return View;
});