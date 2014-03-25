angular.module('eAuction.items').controller('itemsController', ['$scope', '$routeParams', '$location', 'Global', 'Items', function ($scope, $routeParams, $location, Global, Items) {
    $scope.global = Global;

    $scope.create = function() {
        var item = new Items({
            title: this.title,
            description: this.description
        });

        item.$save(function(response) {
            console.log(response);
            $location.path("items/" + response.id);
        });

        this.title = "";
        this.content = "";
    };

    }]);