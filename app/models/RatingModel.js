

module.exports = function(sequelize, DataTypes) {

	var Rating = sequelize.define('Rating', {
			sellerID: DataTypes.INTEGER,		//Need to associate this with item owner
			explanation: DataTypes.TEXT,
			rating: DataTypes.FLOAT
		},
		{
			associate: function(models){
				Rating.belongsTo(models.User);
			}
		}
	);

	return Rating;
};
