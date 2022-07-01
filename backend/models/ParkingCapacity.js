export default (sequelize, DataTypes) => sequelize.define('parking_capacities', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    parkingId: { type: DataTypes.INTEGER, allowNull:false },
    capacityId: { type: DataTypes.INTEGER, allowNull:false },
}, {
    createdAt: false,
    updatedAt: false
});


