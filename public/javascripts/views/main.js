//
// Verify view
//
define([
    "i18n",
    "text!templates/main.html",
    "views/taskPopup",
    "views/aceView",
    "views/visual",
    "views/checkResult"
], function(i18n, template, TaskPopupView, AceView, VisualView, CheckResultView) {
    console.log('views/main.js');
    var View = Backbone.View.extend({
        events: {
            "click .active-js": "openJs",
            "click .active-html": "openHtml"
        },
        initialize: function(options) {
            // Variables
            this.historyFlag = false;
            this.options = options || {};
            // Templates
            this.templates = _.parseTemplate(template);
            // Sub views
            this.view = {
                aceView: new AceView({
                    postHtml: this.postHtml.bind(this),
                    postJs: this.postJs.bind(this)
                }),
                visual: new VisualView(),
                checkResult: new CheckResultView({
                    openPopup: this.openPopup.bind(this)
                })
            };
            this.firstModelAt = 0;
            var Tasks = Backbone.Collection.extend({
                url: "data/tasks.json"
            });
            this.tasks = new Tasks();
        },
        render: function() {
            var self = this;
            var tpl = _.template(this.templates['main-tpl']);
            var data = {
                i18n: i18n
            };
            this.$el.html(tpl(data));
            this.view.visual.setElement(this.$(".panel-view-result")).render();
            this.hmtlAce = this.view.aceView.setElement(this.$('.panel-code-html')).render("", true);
            this.jsAce = this.view.aceView.setElement(this.$('.panel-code-js')).render("javascript", true);
            this.view.checkResult.setElement(this.$('.panel-check-result')).render();
            //this.$('panel-code-html').html(this.view.aceView.render().el);
            this.tasks.fetch({
                success: function(collection, response, options) {
                    self.currentTask = collection.at(self.firstModelAt);
                    self.numberOfTasks = collection.length;
                    self.openPopup(self.currentTask, self.numberOfTasks);
                }
            });
            return this;
        },
        destroy: function() {
            for (var v in this.view) {
                if (this.view[v]) this.view[v].destroy();
            }
            this.remove();
        },
        openPopup: function(taskModel, numberOfTasks) {
            var self = this;
            this.view.taskPopup = new TaskPopupView();
            this.dialog = new BootstrapDialog({
                onhidden: function() { 
                    self.view.taskPopup.destroy();
                },
                draggable: true
            });
            if (!taskModel && !numberOfTasks) {
                taskModel = self.currentTask;
                numberOfTasks = self.numberOfTasks;
            }
            this.dialog.realize();
            self.view.taskPopup.setElement(this.dialog.getModalDialog()).render(taskModel, numberOfTasks);
            this.dialog.open();
        },
        postHtml: function(editor) {
            var self = this;
            editor.getSession().on("change", function(event) {
                try {
                    self.view.visual.doc.body.innerHTML = editor.getValue();
                    self.postJs(self.jsAce.editor);
                } catch(e) {
                    console.log(e);
                }
            });
        },
        postJs: function(editor) {
            var self = this;
            editor.getSession().on("change", function(event) {
                self.lastUpdatedTime = moment.now();
                
                setTimeout(function() {
                    if (!self.lastUpdatedTime || moment().diff(self.lastUpdatedTime) > 1000) {
                        self.view.visual.loadScript(editor.getValue());
                    }
                }, 1000);
                //self.lastUpdatedTime = moment.now();
            });
            self.view.visual.loadScript(editor.getValue());
        },
        openHtml: function(event) {
            event.preventDefault();
            this.$(".active-js").removeClass("active");
            this.$(".panel-code-js").css("z-index", "10");
            this.$(".active-html").addClass("active");
            this.$(".panel-code-html").css("z-index", "100");
        },
        openJs: function(event) {
            event.preventDefault();
            this.$(".active-html").removeClass("active");
            this.$(".panel-code-html").css("z-index", "10");
            this.$(".active-js").addClass("active");
            this.$(".panel-code-js").css("z-index", "100");
        }
    });
    return View;
});