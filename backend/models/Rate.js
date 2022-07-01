export default (sequelize, DataTypes) => sequelize.define('rates', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    price: { type: DataTypes.DECIMAL(10,2), allowNull:false },
    time: { type: DataTypes.TIME, allowNull:false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});


