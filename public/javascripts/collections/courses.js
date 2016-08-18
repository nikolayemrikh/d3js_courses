//
// Verify view
//
define([], function() {
    console.log('collections/course.js');
    var Collection = Backbone.Collection.extend({
        url: "/course",
    });
    return Collection;
});