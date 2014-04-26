angular.module('eAuction.addresses').controller('addressesController', ['$scope', '$routeParams', '$location', 'Global', 'Addresses', 'AddressChosen', function ($scope, $routeParams, $location, Global, Addresses, AddressChosen) {
    $scope.global = Global;
    //$scope.fullAddr = null;

    $scope.selectAddr = function(addr) {
        $scope.fullAddr = addr.street + " " + addr.city + " " + addr.state + " " + addr.zip;
        AddressChosen.setProperty(addr.id);
    };

    $scope.create = function() {
        var address = new Addresses({
            street: this.street,
            street2: this.street2,
            city: this.city,
            state: this.state,
            zip: this.zip
        });

        address.$save(function(response) {
            console.log(response);
            //$location.path("addresses/" + response.id);
            $location.path("/");
        });

        this.street = "";
        this.street2 = "";
        this.city = "";
        this.state = "";
        this.zip = "";
    };

    $scope.remove = function(address) {
        if (address) {
            address.$remove();  

            for (var i in $scope.addresses) {
                if ($scope.addresses[i] == address) {
                    $scope.addresses.splice(i, 1);
                }
            }
        }
        else {
            $scope.address.$remove();
            $location.path('addresses');
        }
    };

    $scope.update = function() {
        var address = $scope.address;
        if (!address.updated) {
            address.updated = [];
        }
        address.updated.push(new Date().getTime());

        address.$update(function() {
            $location.path('addresses/' + address.id);
        });
    };

    $scope.find = function() {
        Addresses.query(function(addresses) {
            $scope.addresses = addresses;
        });
    };

    $scope.findOne = function() {
        Addresses.get({
            addressId: $routeParams.addressId
        }, function(address) {
            $scope.address = address;
        });
    };

}]);