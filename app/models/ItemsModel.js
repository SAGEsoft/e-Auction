

module.exports = function(sequelize, DataTypes) {

	var Item = sequelize.define('Item', {
			title: DataTypes.STRING,
			description: DataTypes.TEXT
		},
		{
			associate: function(models){
				Item.belongsTo(models.User);
			}
		}
	);

	return Item;
};
