// auto_complete service used for items REST endpoint
angular.module('eAuction.auto_completes').factory("Auto_Completes", ['$resource', function($resource) {
    return $resource('auto_completes/:auto_completeId', {
        auto_completeId: '@id'
    });
}]);