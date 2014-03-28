

module.exports = function(sequelize, DataTypes) {

	var Item = sequelize.define('Item', {
			title: DataTypes.STRING,
			description: DataTypes.TEXT,
			url: DataTypes.STRING,
			location: DataTypes.INTEGER,
			category_id: DataTypes.STRING,
			auto_id: DataTypes.INTEGER
		},
		{
			associate: function(models){
				Item.belongsTo(models.User);
			}
		}
	);

	return Item;
};
