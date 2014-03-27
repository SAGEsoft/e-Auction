//Setting up route
angular.module('eAuction').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/items', {
            templateUrl: 'views/items/list.html'
        }).
        when('/items/create', {
            templateUrl: 'views/items/create.html'
        }).
        when('/items/:itemId/edit', {
            templateUrl: 'views/items/edit.html'
        }).
        when('/items/:itemId', {
            templateUrl: 'views/items/view.html'
        }).
        when('/articles', {
            templateUrl: 'views/articles/list.html'
        }).
        when('/articles/create', {
            templateUrl: 'views/articles/create.html'
        }).
        when('/articles/:articleId/edit', {
            templateUrl: 'views/articles/edit.html'
        }).
        when('/articles/:articleId', {
            templateUrl: 'views/articles/view.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('eAuction').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);