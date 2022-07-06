export default (sequelize, DataTypes) => sequelize.define('transactions', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    vehicleId: { type: DataTypes.INTEGER, allowNull:false },
    plateNumber: { type: DataTypes.STRING, allowNull:false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
})


