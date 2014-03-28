

module.exports = function(sequelize, DataTypes) {

	var Credit_Card = sequelize.define('Credit_Card', {
			card_num: DataTypes.INTEGER(16),
			card_type: DataTypes.STRING(10),
			exp: DataTypes.DATE
		},
		{
			associate: function(models){
				Credit_Card.belongsTo(models.User);
			}
		}
	);

	return Credit_Card;
};
