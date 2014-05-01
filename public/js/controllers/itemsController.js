angular.module('eAuction.items').controller('itemsController', ['$scope', '$routeParams', '$location', 'Global', 'Items', 'Categories', 'AddressChosen', function ($scope, $routeParams, $location, Global, Items, Categories, AddressChosen) {
    $scope.global = Global;
    $scope.selectCategory = null;
    $scope.selectCategory_title = null;
    $scope.selectConsole = null;
    $scope.selectConsole_title = null;
    
    $scope.selectedAuto_Complete = null;
    $scope.auto_completes = {};
    
    $scope.searchAuto_Complete = function(term) {
        Auto_Completes.query(function(auto_completes) {
            $scope.auto_completes = auto_completes;
        });
    };
    
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
            CategoryId: this.selectCategory,
            AddressId: AddressChosen.getProperty(),
            image: this.image,
            auction_ended: false
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

        if ( bidder == item.buyer_id )
        {
            alert('You are already the highest bidder!');
            item.$bid(function() {
                $location.path('items/' + item.id);
            });
            return;
        }

        if ( bidder == item.UserId )
        {
            alert('You can\'t bid on your own item!');
            item.$bid(function() {
                $location.path('items/' + item.id);
            });
            return;
        }

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