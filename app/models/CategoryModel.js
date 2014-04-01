module.exports = function(sequelize, DataTypes) {

	var Category = sequelize.define('Category', {
			summary: DataTypes.STRING,
			statistics: DataTypes.FLOAT
		},
		{
			associate: function(models){
				Category.hasMany(Category, {as: 'Children', foreignKey: 'ParentId', through: null});
			}
		}
	);

	return Category;
};