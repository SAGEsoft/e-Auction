/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');

/**
 * Find item by id
 * Note: This is called every time that the parameter :itemId is used in a URL. 
 * Its purpose is to preload the item on the req object then call the next function. 
 */
exports.item = function(req, res, next, id) {
    console.log('id => ' + id);
    db.Item.find({ where: {id: id}, include: [db.User]}).success(function(item){
        if(!item) {
            console.log('Failed to load item');
            return next(new Error('Failed to load item ' + id));
        } else {
            req.item = item;
            return next();            
        }
    }).error(function(err){
        return next(err);
    });
};

/**
 * Create a item
 */
exports.create = function(req, res) {
    // augment the item by adding the UserId
    req.body.UserId = req.user.id;
    // save and return and instance of item on the res object. 
    db.Item.create(req.body).success(function(item){
        if(!item){
            return res.send('users/signup', {errors: err});
        } else {
            return res.jsonp(item);
        }
    }).error(function(err){
        return res.send('users/signup', { 
            errors: err,
            status: 500
        });
    });
};

/**
 * Update a item
 */
exports.update = function(req, res) {

    // create a new variable to hold the item that was placed on the req object.
    var item = req.item;

    item.updateAttributes({
        title: req.body.title,
        description: req.body.description
    }).success(function(a){
        return res.jsonp(a);
    }).error(function(err){
        return res.render('error', {
            error: err, 
            status: 500
        });
    });
};

exports.bid = function(req, res) {

    // create a new variable to hold the item that was placed on the req object.
    var item = req.item;
    console.log("here", req.body.current_bid );
    item.updateAttributes({
        current_bid: req.body.current_bid,
        buyer_id: req.body.buyer_id
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
 * Delete an item
 */
exports.destroy = function(req, res) {

    // create a new variable to hold the item that was placed on the req object.
    var item = req.item;

    item.destroy().success(function(){
        return res.jsonp(item);
    }).error(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Show an item
 */
exports.show = function(req, res) {
    // Sending down the item that was just preloaded by the items.item function
    // and saves item on the req object.
    return res.jsonp(req.item);
};

/**
 * List of items
 */
exports.all = function(req, res) {
    db.Item.findAll({include: [db.User]}).success(function(items){
        return res.jsonp(items);
    }).error(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};
