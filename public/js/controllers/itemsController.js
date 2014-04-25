angular.module('eAuction.items').controller('itemsController', ['$scope', '$routeParams', '$location', 'Global', 'Items', 'Categories', function ($scope, $routeParams, $location, Global, Items, Categories) {
    $scope.global = Global;
    $scope.selectCategory = null;
    $scope.selectCategory_title = null;
    $scope.selectConsole = null;
    $scope.selectConsole_title = null;
    
    $scope.findCategory = function() {
        Categories.query(function(c) {
            $scope.categories = c;
        });
    };

    $scope.getCategory = function(child,leaf){
        $scope.selectCategory = leaf.id;
        $scope.selectCategory_title = leaf.title;
        $scope.selectConsole = leaf.ParentId;
        $scope.selectConsole_title = child.title;
    };

    $scope.create = function() {
        var item = new Items({
            title: this.title,
            description: this.description,
            url: this.url,
            reserve_price: this.reserve_price,
            buy_it_now: this.buy_it_now,
            current_bid: parseFloat(this.current_bid),
            console_id: this.selectConsole,
            CategoryId: this.selectCategory
        });


        item.$save(function(response) {
            console.log(response);
            $location.path("items/" + response.id);
        });

        this.title = "";
        this.content = "";
    };

    $scope.remove = function(item) {
        if (item) {
            item.$remove();  

            for (var i in $scope.items) {
                if ($scope.items[i] == item) {
                    $scope.items.splice(i, 1);
                }
            }
        }
        else {
            $scope.item.$remove();
            $location.path('items');
        }
    };

    $scope.update = function() {
        var item = $scope.item;
        if (!item.updated) {
            item.updated = [];
        }
        item.updated.push(new Date().getTime());

        item.$update(function() {
            $location.path('items/' + item.id);
        });
    };

    $scope.find = function() {
        Items.query(function(items) {
            $scope.items = items;
        });
    };

    $scope.findOne = function() {
        Items.get({
            itemId: $routeParams.itemId
        }, function(item) {
            $scope.item = item;
        });
    };

    $scope.bid = function(bid) {
        var bidder = $scope.global.user.id;
        console.log("Bidder", bidder);
        var item = $scope.item;
        if ( bid >= 1.05 * item.current_bid )
        {
            item.current_bid = bid;
            item.buyer_id = bidder;
            alert('You are the highest bidder!');
            item.$bid(function() {
                $location.path('items/' + item.id);
            });
        }
        else
        {
            alert('Your bid is not high enough!');
            item.$bid(function() {
                $location.path('items/' + item.id);
            });
        }
    };

}]);