/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');

exports.auto_complete = function(req, res, next, id) {
    console.log('id => ' + id);
    db.Auto_Complete.find({ where: {id: id}}).success(function(item){
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
 * Show a auto item
 */
exports.show = function(req, res) {

    return res.jsonp(req.item);
};


/**
 * List of categories
 */
exports.all = function(req, res) {
    db.Auto_Complete.findAll().success(function(items){
        return res.jsonp(items);
    }).error(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};
