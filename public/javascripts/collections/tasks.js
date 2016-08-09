//
// Verify view
//
define([], function() {
    console.log('collections/task.js');
    var Collection = Backbone.Collection.extend({
        url: "/task"
    });
    return Collection;
});