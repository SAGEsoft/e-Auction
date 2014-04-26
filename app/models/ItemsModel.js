

module.exports = function(sequelize, DataTypes) {

	var Item = sequelize.define('Item', {
			title: DataTypes.STRING,
			description: DataTypes.TEXT,
			url: DataTypes.STRING,
			auto_id: DataTypes.INTEGER,
			buyer_id: DataTypes.INTEGER, /* user id of most recent bidder */
			current_bid: DataTypes.FLOAT,
			buy_it_now: DataTypes.FLOAT,
			reserve_price: DataTypes.FLOAT,
			console_id: DataTypes.INTEGER,
			image: DataTypes.STRING
		},
		{
			associate: function(models){
				Item.belongsTo(models.User);
				Item.belongsTo(models.Address); /* address of seller */
				Item.belongsTo(models.Category);
			}
		}
	);

	return Item;
};
