/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');

/**
 * Find category by id
 * Note: This is called every time that the parameter :itemId is used in a URL. 
 * Its purpose is to preload the item on the req object then call the next function. 
 */
exports.category = function(req, res, next, id) {
    console.log('id => ' + id);
    db.Category.find({ where: {id: id}}).success(function(item){
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
 * Show a category
 */
exports.show = function(req, res) {

    return res.jsonp(req.item);
};

/**
 * List of categories
 */
exports.all = function(req, res) {
    db.Category.findAll().success(function(items){
        return res.jsonp(items);
    }).error(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};
