export default (sequelize, DataTypes) => sequelize.define('detailed_transactions', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    transactionId: { type: DataTypes.INTEGER, allowNull:false },
    parkingId: { type: DataTypes.INTEGER, allowNull:false },
    fee: { type: DataTypes.FLOAT, allowNull:false },
    status: { type: DataTypes.INTEGER, allowNull:false },
    entryExitDateTime:  DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});


