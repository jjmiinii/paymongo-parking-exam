export default (sequelize, DataTypes) => sequelize.define('capacity_rate', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    capacityId: { type: DataTypes.INTEGER, allowNull:false },
    rateId: { type: DataTypes.INTEGER, allowNull:false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});