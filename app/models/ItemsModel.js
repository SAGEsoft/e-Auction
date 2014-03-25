

module.exports = function(sequelize, DataTypes) {

	var Item2 = sequelize.define('Item2', {
			title: DataTypes.STRING,
			description: DataTypes.TEXT
		},
		{
			freezeTableName: true
		},
		{
			associate: function(models){
				Item2.belongsTo(models.User);
			}
		}
	);

	return Item2;
};
