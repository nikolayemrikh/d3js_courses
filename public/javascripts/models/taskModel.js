define([], function() {
    var Model = Backbone.Model.extend({
        url: "/course"
    });
    return Model;
})