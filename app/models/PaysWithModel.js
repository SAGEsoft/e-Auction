

module.exports = function(sequelize, DataTypes) {

	var Pays_with = sequelize.define('Pays_with', {
		
		},
		{
			associate: function(models){
				Pays_with.belongsTo(models.User);
				Pays_with.belongsTo(models.Credit_Card);
				//We might need to change this to include the actual credit card number instead of the credit card id
			}
		}
	);

	return Pays_with;
};
