//Items service used for items REST endpoint
angular.module('eAuction.items').factory("Items", ['$resource', function($resource) {
    return $resource('items/:itemId', {
        itemId: '@id'
    }, {
        update: { method: 'PUT' },
        bid: { method: 'PUT'}
    });
}]);