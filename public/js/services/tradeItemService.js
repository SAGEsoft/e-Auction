//TradeItems service used for tradeItems REST endpoint
angular.module('eAuction.tradeItems').factory("TradeItems", ['$resource', function($resource) {
    return $resource('tradeItems/:tradeItemId', {
        tradeItemId: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
