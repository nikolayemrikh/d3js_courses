define([], function() {
    var Model = Backbone.Model.extend({
        urlRoot: "/task",
        idAttribute: "_id"
    });
    return Model;
})