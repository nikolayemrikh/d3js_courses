/*
    global Backbone, app, _, fetch $
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
            "click .btn-submit": "sendFiles",
            "click .btn-add-file-input": "addAnotherFileInput",
            "click .btn-remove-file-input": "removeLastFileInput"
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
            // Атеншен, костыли! Этот код я засунул в onchange элемента .files-input-container в html, потому что тут не получается поймать момент, когда оно загрузится, только таймером, а это зашквар. А вообще я наверно просто дебил.
            // var filesInputContainer = document.querySelector(".files-input-container");
            // filesInputContainer.onchange = function(e) {
            //     console.log(e)
            //     var target = e.target;
            //     if (target.tagName != "INPUT" && target.getAttribute("type") != "file") return;
            //     var name = target.getAttribute("name");
            //     var formData = new FormData(document.forms.storage_form);
            //     var data = formData.get(name);
            //     var regex = /\d+$/;
            //     data.order = Number.parseInt(regex.exec(name)[0]);
            //     formData.set(name, data)
            //     console.log(formData.get(name))
            // }

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
        sendFileByFetch: function(url, formData) {
            var options = {
                body: formData
            };
            let promise = fetch(url, options);
            promise.then(function(response) {
                console.log(response)
            }).catch(function(err) {
                console.log(err);
            });
        },
        sendFiles: function(event) {
            var self = this;
            event.preventDefault();
            event.stopPropagation();
            var formData = new FormData(document.forms.storage_form);
            // this.sendFileByFetch("/storage", formData)
            console.log(formData)
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/storage");
            xhr.send(formData);
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return;
                if (xhr.status != 200) {
                    console.log(xhr);
                }
                else {
                    console.log(xhr.responseText)
                    self.send(JSON.parse(xhr.responseText));
                }

            }
        },
        addAnotherFileInput: function(event) {
            event.preventDefault();
            event.stopPropagation();

            var filesInputContainer = document.querySelector(".files-input-container");

            var template = document.querySelector("#course-file-temp").content.cloneNode(true);
            var label = template.children[0];
            var input = label.children[0];
            var name = input.getAttribute("name");
            
            var lastInputNumberStr = document.querySelector(".files-input-container").dataset["lastInputNumber"];
            console.log(lastInputNumberStr)
            var lastInputNumber = Number.parseInt(lastInputNumberStr);
            console.log(lastInputNumber)
            var newlastInputNumber = lastInputNumber + 1;
            console.log(newlastInputNumber)
            input.setAttribute("name", name + newlastInputNumber);
            document.querySelector(".files-input-container").dataset["lastInputNumber"] = newlastInputNumber.toString();
            console.log(lastInputNumberStr)
            
            filesInputContainer.appendChild(label.cloneNode(true));
        },
        removeLastFileInput: function(event) {
            event.preventDefault();
            event.stopPropagation();

            var filesInputContainer = document.querySelector(".files-input-container");
            var allAnotherFileInputs = filesInputContainer.querySelectorAll(".add-another-file");
            if (!allAnotherFileInputs.length) return;
            var lastFileInput = allAnotherFileInputs[allAnotherFileInputs.length - 1];

            filesInputContainer.removeChild(lastFileInput);
            
            var lastInputNumberStr = document.querySelector(".files-input-container").dataset["lastInputNumber"];
            var lastInputNumber = Number.parseInt(lastInputNumberStr);
            var newlastInputNumber = lastInputNumber - 1;
            document.querySelector(".files-input-container").dataset["lastInputNumber"] = newlastInputNumber.toString();
        }
    });
    return View;
});
