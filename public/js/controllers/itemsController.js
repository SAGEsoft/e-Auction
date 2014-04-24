angular.module('eAuction.items').controller('itemsController', ['$scope', '$routeParams', '$location', 'Global', 'Items', function ($scope, $routeParams, $location, Global, Items) {
    $scope.global = Global;

    /* setting front end categories statically here for now, should really pull from database */
    $scope.categories = [
        {name: 'Sony', children: [
            {name: 'PlayStation 3', children: [
                {name: 'RPG'}, 
                {name: 'Shooter'} 
            ]},
            {name: 'PlayStation 4', children:[
                {name: 'Arcade'}
            ]}
        ]},
        {name: 'Microsoft', children: [
            {name: 'Xbox 360', children: [
                {name:'Fighter'}
            ]}
        ]}
    ];

    $scope.create = function() {
        var item = new Items({
            title: this.title,
            description: this.description,
            url: this.url,
            reserve_price: this.reserve_price,
            buy_it_now: this.buy_it_now,
            current_bid: parseFloat(this.current_bid)
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
        item.current_bid = bid;
        item.buyer_id = bidder;
        item.$bid(function() {
            $location.path('items/' + item.id);
        });
    };

    }]);