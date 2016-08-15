define([], function() {
    var Model = Backbone.Model.extend({
        urlRoot: "/course"
    });
    return Model;
})