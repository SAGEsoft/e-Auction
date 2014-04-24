
var users       = require('../app/controllers/users');
var articles    = require('../app/controllers/articles');
var index       = require('../app/controllers/index');
var items       = require('../app/controllers/items');
var tradeItems  = require('../app/controllers/tradeItems');
var addresses   = require('../app/controllers/addresses');

exports.init = function(app, passport, auth) {

    console.log('Initializing Routes');

    // User Routes
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);
    app.get('/users/me', users.me);

    // Setting up the users api
    app.post('/users', users.create);

    // Setting the local strategy route
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);

    // Finish with setting up the userId param
    app.param('userId', users.user);

    // Article Routes
    app.get('/articles', articles.all);
    app.post('/articles', auth.requiresLogin, articles.create);
    app.get('/articles/:articleId', articles.show);
    app.put('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.update);
    app.del('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy);

    // Item Routes
    app.get('/items', items.all);
    app.post('/items', auth.requiresLogin, items.create);
    app.get('/items/:itemId', items.show);
   // app.put('/items/:itemId', auth.requiresLogin, auth.item.hasAuthorization, items.update);
    app.put('/items/:itemId', auth.requiresLogin, items.bid);
    app.del('/items/:itemId', auth.requiresLogin, auth.item.hasAuthorization, items.destroy);
    
    // TradeItem Routes
    app.get('/tradeItems', tradeItems.all);
    app.post('/tradeItems', auth.requiresLogin, tradeItems.create);
    app.get('/tradeItems/:tradeItemId', tradeItems.show);
    //app.put('/tradeItems/:tradeItemId', auth.requiresLogin, auth.tradeItem.hasAuthorization, tradeItems.update);
    app.del('/tradeItems/:tradeItemId', auth.requiresLogin, auth.tradeItem.hasAuthorization, tradeItems.destroy);

    // Address Routes
    app.get('/addresses', addresses.all);
    app.post('/addresses', auth.requiresLogin, addresses.create);
    app.get('/addresses/:addressId', addresses.show);
    app.put('/addresses/:addressId', auth.requiresLogin, auth.address.hasAuthorization, addresses.update);
    app.del('/addresses/:addressId', auth.requiresLogin, auth.address.hasAuthorization, addresses.destroy);


    // Finish with setting up the articleId param
    // Note: the articles.article function will be called everytime then it will call the next function. 
    app.param('articleId', articles.article);
    app.param('itemId', items.item);
    app.param('tradeItemId', tradeItems.tradeItem);
    app.param('addressId', addresses.address);


    // Home route
    app.get('/', index.render);

};
