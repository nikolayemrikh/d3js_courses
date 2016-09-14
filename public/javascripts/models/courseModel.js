define([], function() {
    var Model = Backbone.Model.extend({
        urlRoot: "/course",
        idAttribute: "courseId"
    });
    return Model;
})