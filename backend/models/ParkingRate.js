export default (sequelize, DataTypes) => sequelize.define('parking_rates', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    parkingId: { type: DataTypes.INTEGER, allowNull:false },
    rateId: { type: DataTypes.INTEGER, allowNull:false },
});


