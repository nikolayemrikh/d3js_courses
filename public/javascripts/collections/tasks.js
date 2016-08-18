//
// Verify view
//
define([], function() {
    console.log('collections/task.js');
    var Collection = Backbone.Collection.extend({
        url: "/task",
        /*sort_key: "number", // default sort key
        comparator: function(item) {
            return item.get(this.sort_key);
        },
        sortByField: function(fieldName) {
            this.sort_key = fieldName;
            this.sort();
        }*/
    });
    return Collection;
});