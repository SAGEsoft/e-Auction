module.exports = function(sequelize, DataTypes) {

	var TradeItem = sequelize.define('TradeItem', {
			title: DataTypes.STRING,
			description: DataTypes.TEXT,
			url: DataTypes.STRING,
			auto_id: DataTypes.INTEGER,
			desired_item: DataTypes.STRING,
			console_id: DataTypes.INTEGER,
			image: DataTypes.STRING
		},
		{
			associate: function(models){
				TradeItem.belongsTo(models.User);
				TradeItem.belongsTo(models.Address); /* address of seller */
				TradeItem.belongsTo(models.Category);
			}
		}
	);

	return TradeItem;
};
