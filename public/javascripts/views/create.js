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
            //"submit #create-task-form": "send"
            "click .btn-submit": "sendFiles"
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
        send: function(files) {
            var self = this;
            var form = document.forms.create_task_form;
            var newObj = new this.Model();
            if (this.collectionName == "task") {
                newObj.set({
                    isChallenge: form.elements.is_challenge.value == "challenge" ? true : false,
                    taskName: form.elements.task_title.value,
                    taskDescription: form.elements.task_description.value,
                    courseId: this.courseId,
                    //Временно зададим номер, потому что нельзя послать в бекбоне модель с айди..
                    number: Number.parseInt(form.elements.task_number_in_course.value)
                });
            }
            else if (this.collectionName == "course") {
                newObj.set({
                    name: form.elements.course_name.value,
                    number: Number.parseInt(form.elements.course_number.value),
                    description: form.elements.course_description.value,
                    files: files
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
        },
        sendFiles: function(event) {
            var self = this;
            event.preventDefault();
            event.stopPropagation();
            var formData = new FormData(document.forms.storage_form);
            console.log(formData)
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/storage");
            xhr.send(formData);
            xhr.onreadystatechange = function() { // (3)
                if (xhr.readyState != 4) return;
                if (xhr.status != 200) {
                    console.log(xhr);
                }
                else {
                    console.log(xhr.responseText)
                    self.send(JSON.parse(xhr.responseText));
                }

            }
        }
    });
    return View;
});