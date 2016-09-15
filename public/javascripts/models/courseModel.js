define([], function() {
    var Model = Backbone.Model.extend({
        urlRoot: "/course",
        idAttribute: "_id"
    });
    return Model;
})