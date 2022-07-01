export default (sequelize, DataTypes) => sequelize.define('vehicles', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    plateNumber: { type: DataTypes.STRING, allowNull:false },
    vehicleTypeId: { type: DataTypes.INTEGER, allowNull:false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});


