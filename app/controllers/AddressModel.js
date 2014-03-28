

module.exports = function(sequelize, DataTypes) {

	var Address = sequelize.define('Address', {
			street: DataTypes.STRING,
			street2: DataTypes.STRING,
			city: DataTypes.TEXT,
			state: DataTypes.STRING(2),
			zip: DataTypes.INTEGER(5)
		},
		{
			associate: function(models){
				Address.belongsTo(models.User);
			}
		}
	);

	return Address;
};
