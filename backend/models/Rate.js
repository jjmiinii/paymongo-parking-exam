export default (sequelize, DataTypes) => sequelize.define('rates', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    amount: { type: DataTypes.DECIMAL(10,2), allowNull:false },
    hour: { type: DataTypes.INTEGER, allowNull:false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});


