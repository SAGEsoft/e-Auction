module.exports = function(sequelize, DataTypes) {

	var Auto_Complete = sequelize.define('Auto_Complete', {
			title: DataTypes.STRING,
			url: DataTypes.STRING,
			description: DataTypes.TEXT,
            image: DataTypes.STRING
		}
	);

	return Auto_Complete;
};