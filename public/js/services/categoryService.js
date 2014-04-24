//Category service used for items REST endpoint
angular.module('eAuction.categories').factory("Categories", ['$resource', function($resource) {
    return $resource('categories/:categoryId', {
        categoryId: '@id'
    });
}]);