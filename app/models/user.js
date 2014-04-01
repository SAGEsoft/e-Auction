
/**
	* User (Individual) Model
	*/

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('User', 
		{
			name: DataTypes.STRING,
			email: DataTypes.STRING,
			phone: DataTypes.INTEGER(10),
			username: DataTypes.STRING,
			user_type: DataTypes.STRING,
			hashedPassword: DataTypes.STRING,
			salt: DataTypes.STRING,
			birth_date: DataTypes.DATE,
			gender: DataTypes.STRING,
			income: DataTypes.FLOAT
		},
		{
			instanceMethods: {
				makeSalt: function() {
					return crypto.randomBytes(16).toString('base64'); 
				},
				authenticate: function(plainText){
					return this.encryptPassword(plainText, this.salt) === this.hashedPassword;
				},
				encryptPassword: function(password, salt) {
					if (!password || !salt) return '';
					salt = new Buffer(salt, 'base64');
					return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
				}
			},
			associate: function(models) {
				User.hasMany(models.Article);
				User.hasMany(models.Item);
				User.hasMany(models.Address);
				User.hasMany(models.Rating);
				User.hasMany(models.Credit_Card);
			}
		}
	);

	return User;
};
