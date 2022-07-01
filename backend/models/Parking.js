export default (sequelize, DataTypes) => sequelize.define('parkings', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    floor: { type: DataTypes.STRING, allowNull:false },
    distance: { type: DataTypes.INTEGER, allowNull:false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
});


