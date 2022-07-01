export default (sequelize, DataTypes) => sequelize.define('parking_settings', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    capacityId: { type: DataTypes.INTEGER, allowNull:false },
    vehicleTypeId: { type: DataTypes.INTEGER, allowNull:false }
}, {
    createdAt: false,
    updatedAt: false
});


