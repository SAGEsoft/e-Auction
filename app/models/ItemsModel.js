

module.exports = function(sequelize, DataTypes) {

	var Item = sequelize.define('Item', {
			title: DataTypes.STRING,
			description: DataTypes.TEXT,
			url: DataTypes.STRING,
			//location: DataTypes.INTEGER, /* address of seller */
			category_id: DataTypes.STRING,
			auto_id: DataTypes.INTEGER,
			buyer_id: DataTypes.INTEGER, /* id of most recent bidder */
			current_bid: DataTypes.FLOAT,
			buy_it_now: DataTypes.FLOAT,
			reserve_price: DataTypes.FLOAT
		},
		{
			associate: function(models){
				Item.belongsTo(models.User);
				Item.belongsTo(models.Address);
			}
		}
	);

	return Item;
};
