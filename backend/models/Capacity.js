export default (sequelize, DataTypes) => sequelize.define('capacities', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    description: { type: DataTypes.STRING, allowNull:false },
    size: { type: DataTypes.INTEGER, allowNull:false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});


