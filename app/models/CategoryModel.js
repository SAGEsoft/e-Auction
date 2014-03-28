module.exports = function(sequelize, DataTypes) {

	var Category = sequelize.define('Category', {
			summary: DataTypes.STRING,
			statistics: DataTypes.FLOAT
		},
		{
			associate: function(models){
				Category.belongsTo( models.Parent );
			}
		}
	);

	return Category;
};