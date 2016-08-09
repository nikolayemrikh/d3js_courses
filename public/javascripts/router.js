//
// Router
//
/* global app, Backbone, _, $ */

define(["collections/tasks"], function(Tasks) {
    console.log('router.js');
    var $body = $('body');
    var $content = $('<div id="content"></div>');
    var tasks = new Tasks();
    tasks.fetch();
    var Router = Backbone.Router.extend({
        routes: {
            "start(/:course)": "start",
            "main/:page": "main",
            "editTask/:page": "editTask",
            "login": "login",
            "*path": "something"
        },
        render: function(View, options, auth) {
            if (auth || app.isAuth()) {
                if (app.content) {
                    app.content.destroy();
                }
                $body.html($content);
                options = options || {};
                options.el = $('#content');
                console.log(options.page)
                app.content = new View(options);
                app.content.render();
            }
            else {
                this.navigate("login", {
                    trigger: true
                });
            }
        },
        login: function() {
            var self = this;
            require([
                "views/login"
            ], function(View) {
                self.render(View, null, true);
            });
        },
        something: function() {
            if (app.isAuth()) {
                var role = app.profile.get("role");
                var navigate = "login";
                switch (role) {
                    case 1:
                        navigate = "start";
                        break;
                    case 2:
                        navigate = "start";
                        break;
                    case 3:
                        navigate = "start";
                        break;
                }
                this.navigate(navigate, {
                    trigger: true
                });
            }
            else {
                this.navigate("login", {
                    trigger: true
                });
            }
        },
        start: function(course) {
            var self = this;
            //var role = app.profile.get("role");
            require([
                "views/start"
            ], function(View) {
                app.profile.fetch({
                    success: function(model, response, error) {
                        var role = model.get("role");
                        if (role != 3) role = null;
                        self.render(View, {
                            courseNumber: course,
                            profile: model,
                            role: role
                        }, true);
                    }
                });
                
            });
        },
        main: function(page) {
            var self = this;
            require([
                "views/main"
            ], function(View) {
                console.log(page, tasks.findWhere({
                    number: eval(page)
                }));
                if (page && tasks.findWhere({
                        number: eval(page)
                    })) {
                    self.render(View, {
                        page: page
                    }, true);
                }
                else {
                    //self.render(View, null ,true);
                    self.navigate("start", {
                        trigger: true
                    });
                }
            });
        },
        editTask: function(page) {
            var self = this;
            require([
                "views/editTask"
            ], function(View) {
                if (page && tasks.findWhere({
                        number: eval(page)
                    })) {
                    self.render(View, {
                        page: page
                    }, true);
                }
                else {
                    self.navigate("start", {
                        trigger: true
                    });
                }
            });
        }
    });
    return Router;
});