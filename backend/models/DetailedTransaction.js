export default (sequelize, DataTypes) => sequelize.define('detailed_transactions', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    transactionId: { type: DataTypes.INTEGER, allowNull:false },
    parkingId: { type: DataTypes.INTEGER, allowNull:false },
    fee: { type: DataTypes.DECIMAL(10,2), allowNull:false },
    duration: { type: DataTypes.INTEGER, allowNull:false },
    status: { type: DataTypes.INTEGER, allowNull:false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});


