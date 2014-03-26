angular.module('eAuction.system').controller('SidebarController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [{
        "title": "Articles",
        "link": "articles"
    }, {
        "title": "Create New Article",
        "link": "articles/create"
    }, {
    	"title": "Items",
    	"link": "items"
    }, {
    	"title": "Create New Item",
    	"link": "items/create"
    }];
    
    $scope.isCollapsed = false;
}]);