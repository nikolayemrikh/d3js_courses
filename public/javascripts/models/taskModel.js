define([], function() {
    var Model = Backbone.Model.extend({
        urlRoot: "/task",
        idAttribute: "taskId"
    });
    return Model;
})