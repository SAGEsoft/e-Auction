angular.module('eAuction.sidebar', [])
    .directive('sidebar', [function(){
        var directive ={};
            directive.transclude = true;
            directive.template = '<div class="col-md-3">' +
                '<p class="lead">e-Auction</p>' +
                '<div class="list-group">' +
                '<a href="#!" class="list-group-item">Home</a>' +
                '<a href="#!/items" class="list-group-item">Items</a>' +
                '<a href="#!/items/create" class="list-group-item">Create Item</a>' +
                '<a href="#" class="list-group-item">Link here</a>' +
                '</div>' +
                '</div>';
        return directive;
    }]);

angular.module('eAuction.searchbar', [])
    .directive('searchbar', [function(){
        var directive ={};
            directive.template = '<div class="col-md-9">' +
                '<div class="navbar navbar-default" role="navigation">' +
                    '<!--div class="container"-->' +
                    '<!-- Brand and toggle get grouped for better mobile display -->' +
                        '<form class="navbar-form">' +
                            '<div class="form-group" style="display:inline;">' +
                                '<div class="input-group">' +
                                    '<input type="text" class="form-control" placeholder="Search...">' +
                                    '<span class="input-group-addon">' +
                                    '<span class="glyphicon glyphicon-search"></span>' +
                                    '</span>' +
                                '</div>' +
                            '</div>' +
                        '</form>' +
                        '<div class="navbar-header">' +
                            '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">' +
                                '<span class="sr-only">Toggle navigation</span>' +
                                '<span class="icon-bar"></span>' +
                                '<span class="icon-bar"></span>' +
                                '<span class="icon-bar"></span>' +
                            '</button>' +
                            '<a class="navbar-brand" href="#">All (299)</a>' +
                        '</div>' +
                        '<!-- Collect the nav links, forms, and other content for toggling -->' +
                        '<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">' +
                            '<ul class="nav navbar-nav">' +
                                '<li class="active"><a href="#">Xbox One(11)</a></li>' +
                                '<li><a href="#">Playstation 4 (215)</a></li>' +
                                '<li><a href="#">Nintendo Wii (215)</a></li>' +
                            '</ul>' +
                        '</div><!-- /.navbar-collapse -->' +
                    '<!--/div--><!-- /.container-fluid -->' +
                '</div>' +
            '</div>';
        return directive;
    }]);