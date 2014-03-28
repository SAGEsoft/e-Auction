module.exports = function(sequelize, DataTypes) {

	var Parent = sequelize.define('Parent', {
			summary: DataTypes.STRING,
			statistics: DataTypes.FLOAT
		}
	);

	return Parent;
};