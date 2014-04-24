angular.module('eAuction.tradeItems').controller('tradeItemsController', ['$scope', '$routeParams', '$location', 'Global', 'TradeItems', function ($scope, $routeParams, $location, Global, TradeItems) {
    $scope.global = Global;

    $scope.create = function() {
        var tradeItem = new TradeItems({
            title: this.title,
            description: this.description
        });


        tradeItem.$save(function(response) {
            console.log(response);
            $location.path("tradeItems/" + response.id);
        });

        this.title = "";
        this.content = "";
    };

    $scope.remove = function(tradeItem) {
        if (tradeItem) {
            tradeItem.$remove();  

            for (var i in $scope.tradeItems) {
                if ($scope.tradeItems[i] == tradeItem) {
                    $scope.tradeItems.splice(i, 1);
                }
            }
        }
        else {
            $scope.tradeItem.$remove();
            $location.path('tradeItems');
        }
    };

    $scope.update = function() {
        var tradeItem = $scope.tradeItem;
        if (!tradeItem.updated) {
            tradeItem.updated = [];
        }
        tradeItem.updated.push(new Date().getTime());

        tradeItem.$update(function() {
            $location.path('tradeItems/' + tradeItem.id);
        });
    };

    $scope.find = function() {
        TradeItems.query(function(tradeItems) {
            $scope.tradeItems = tradeItems;
        });
    };

    $scope.findOne = function() {
        TradeItems.get({
            tradeItemId: $routeParams.tradeItemId
        }, function(tradeItem) {
            $scope.tradeItem = tradeItem;
        });
    };

    }]);