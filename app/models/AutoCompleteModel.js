module.exports = function(sequelize, DataTypes) {

	var Auto_Complete = sequelize.define('Auto_Complete', {
			title: DataTypes.STRING,
			url: DataTypes.STRING,
			description: DataTypes.TEXT
		}
	);

	return Auto_Complete;
};