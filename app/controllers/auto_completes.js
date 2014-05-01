/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');

/**
 * List of categories
 */
exports.all = function(req, res, term) {
    db.Category.findAll({
        where: ["title LIKE '{0}%'".format(term)]
    }).success(function(items){
        return res.jsonp(items);
    }).error(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};
