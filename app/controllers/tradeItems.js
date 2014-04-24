/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');

/**
 * Find tradeItem by id
 * Note: This is called every time that the parameter :tradeItemId is used in a URL. 
 * Its purpose is to preload the tradeItem on the req object then call the next function. 
 */
exports.tradeItem = function(req, res, next, id) {
    console.log('id => ' + id);
    db.TradeItem.find({ where: {id: id}, include: [db.User]}).success(function(tradeItem){
        if(!tradeItem) {
            console.log('Failed to load tradeItem');
            return next(new Error('Failed to load tradeItem ' + id));
        } else {
            req.tradeItem = tradeItem;
            return next();            
        }
    }).error(function(err){
        return next(err);
    });
};

/**
 * Create a tradeItem
 */
exports.create = function(req, res) {
    // augment the tradeItem by adding the UserId
    req.body.UserId = req.user.id;
    // save and return and instance of tradeItem on the res object. 
    db.TradeItem.create(req.body).success(function(tradeItem){
        if(!tradeItem){
            return res.send('users/signup', {errors: err});
        } else {
            return res.jsonp(tradeItem);
        }
    }).error(function(err){
        return res.send('users/signup', { 
            errors: err,
            status: 500
        });
    });
};

/**
 * Update a tradeItem
 */
exports.update = function(req, res) {

    // create a new variable to hold the tradeItem that was placed on the req object.
    var tradeItem = req.tradeItem;

    tradeItem.updateAttributes({
        title: req.body.title,
        description: req.body.description,
    }).success(function(a){
        return res.jsonp(a);
    }).error(function(err){
        return res.render('error', {
            error: err, 
            status: 500
        });
    });
};

/**
 * Delete an tradeItem
 */
exports.destroy = function(req, res) {

    // create a new variable to hold the tradeItem that was placed on the req object.
    var tradeItem = req.tradeItem;

    tradeItem.destroy().success(function(){
        return res.jsonp(tradeItem);
    }).error(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Show an tradeItem
 */
exports.show = function(req, res) {
    // Sending down the tradeItem that was just preloaded by the tradeItems.tradeItem function
    // and saves item on the req object.
    return res.jsonp(req.tradeItem);
};

/**
 * List of tradeItems
 */
exports.all = function(req, res) {
    db.TradeItem.findAll({include: [db.User]}).success(function(tradeItems){
        return res.jsonp(tradeItems);
    }).error(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};
