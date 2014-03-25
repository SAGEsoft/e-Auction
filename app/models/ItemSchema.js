

module.exports = function(sequelize, DataTypes) {

	var Items = sequelize.define('Items3', {
			title: DataTypes.STRING,
			description: DataTypes.TEXT,
			url: DataTypes.STRING,
			location: DataTypes.INTEGER,
			category_id: DataTypes.STRING,
			auto_id: DataTypes.INTEGER
		},
		{
			freezeTableName: true
		},
		{
			associate: function(models){
				Items.belongsTo(models.User);
			}
		}
	);

	return Items;
};
