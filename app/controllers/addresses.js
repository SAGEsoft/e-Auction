/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');

/**
 * Find address by id
 * Note: This is called every time that the parameter :addressId is used in a URL. 
 * Its purpose is to preload the address on the req object then call the next function. 
 */
exports.address = function(req, res, next, id) {
    console.log('id => ' + id);
    db.Address.find({ where: {id: id}, include: [db.User]}).success(function(address){
        if(!address) {
            console.log('Failed to load address');
            return next(new Error('Failed to load address ' + id));
        } else {
            req.address = address;
            return next();            
        }
    }).error(function(err){
        return next(err);
    });
};

/**
 * Create an address
 */
exports.create = function(req, res) {
    // augment the address by adding the UserId
    req.body.UserId = req.user.id;
    // save and return and instance of address on the res object. 
    db.Address.create(req.body).success(function(address){
        if(!address){
            return res.send('users/signup', {errors: err});
        } else {
            return res.jsonp(address);
        }
    }).error(function(err){
        return res.send('users/signup', { 
            errors: err,
            status: 500
        });
    });
};

/**
 * Update a address
 */
exports.update = function(req, res) {

    // create a new variable to hold the address that was placed on the req object.
    var address = req.address;

    address.updateAttributes({
        street: req.body.street,
        street2: req.body.street2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip
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
 * Delete an address
 */
exports.destroy = function(req, res) {

    // create a new variable to hold the address that was placed on the req object.
    var address = req.address;

    address.destroy().success(function(){
        return res.jsonp(address);
    }).error(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Show an address
 */
exports.show = function(req, res) {
    // Sending down the address that was just preloaded by the addresses.address function
    // and saves address on the req object.
    return res.jsonp(req.address);
};

/**
 * List of addresses
 */
exports.all = function(req, res) {
    db.Address.findAll({include: [db.User]}).success(function(addresses){
        return res.jsonp(addresses);
    }).error(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};
