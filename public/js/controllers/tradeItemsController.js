angular.module('eAuction.tradeItems').controller('tradeItemsController', ['$scope', '$routeParams', '$location', 'Global', 'TradeItems', 'Categories', 'AddressChosen', 'Auto_Completes', function ($scope, $routeParams, $location, Global, TradeItems, Categories, AddressChosen, Auto_Completes) {
    $scope.global = Global;
    $scope.selectCategory = null;
    $scope.selectCategory_title = null;
    $scope.selectConsole = null;
    $scope.selectConsole_title = null;
    
    $scope.selectedAuto_Complete = null;
    $scope.auto_completes = null;
    $scope.selectAutoTitle = null;
    $scope.selectAutoURL = null;
    $scope.selectAutoDescription = null;
    $scope.selectAutoImage = null;
    
    $scope.searchAuto_Complete = function() {
        Auto_Completes.query(function(auto_completes) {
            $scope.auto_completes = auto_completes;
        });
    };
    
    $scope.getAutoComplete = function(auto) {
        $scope.selectAutoTitle = auto.title;
        $scope.selectAutoURL = auto.url;
        $scope.selectAutoDescription = auto.description;
        $scope.selectAutoImage = auto.image;
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
        var tradeItem = new TradeItems({
            title: $scope.selectAutoTitle,
            description: $scope.selectAutoDescription,
            desired_item: this.desired_item,
            url: $scope.selectAutoURL,
            console_id: this.selectConsole,
            CategoryId: this.selectCategory,
            AddressId: AddressChosen.getProperty(),
            image: $scope.selectAutoImage
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
