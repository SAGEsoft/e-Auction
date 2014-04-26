//Items service used for addresses REST endpoint
angular.module('eAuction.addresses').factory("Addresses", ['$resource', function($resource) {
    return $resource('addresses/:addressId', {
        addressId: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);

angular.module('eAuction.addresses')
    .service('AddressChosen', function () {
        var addr = null;

        return {
            getProperty: function () {
                return addr;
            },
            setProperty: function(value) {
                addr = value;
            }
        };
    });