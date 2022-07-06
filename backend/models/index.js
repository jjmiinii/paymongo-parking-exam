import { Sequelize, DataTypes } from 'sequelize';
import dbConfig from '../database/config';
import Model from './models'

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
        pool: {
            max: dbConfig.max,
            min: dbConfig.min,
            acquire: dbConfig.acquire,
            idle: dbConfig.idle
        }
    }
)

await sequelize.authenticate()
    .then(() => {
        console.log ('===== CONNECTED TO DB =====');
    })
    .catch((error) => {
        console.log ('===== CANNOT CONNECT TO DB =====');
        console.log(error);
    })

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Vehicle = Model.Vehicle(sequelize, DataTypes);
db.VehicleType = Model.VehicleType(sequelize, DataTypes);
db.Parking = Model.Parking(sequelize, DataTypes);
db.Rate = Model.Rate(sequelize, DataTypes);
db.CapacityRate = Model.CapacityRate(sequelize, DataTypes);
db.Capacity = Model.Capacity(sequelize, DataTypes);
db.ParkingCapacity = Model.ParkingCapacity(sequelize, DataTypes);
db.Transaction = Model.Transaction(sequelize, DataTypes);
db.DetailedTransaction = Model.DetailedTransaction(sequelize, DataTypes);
db.VechicleTypeCapacity = Model.VechicleTypeCapacity(sequelize, DataTypes);

//vehicle association
db.Vehicle.belongsTo(db.VehicleType, {
    foreignKey: 'vehicleTypeId'
});

//transaction association
db.Transaction.hasMany(db.DetailedTransaction);
db.Transaction.belongsTo(db.Vehicle, {
    foreignKey: 'vehicleId'
});

//detailed transaction association
db.DetailedTransaction.belongsTo(db.Transaction, {
    foreignKey: 'transactionId'
});
db.DetailedTransaction.belongsTo(db.Parking, {
    foreignKey: 'parkingId'
})

//parking capacity association
db.ParkingCapacity.belongsTo(db.Parking, {
    foreignKey: 'parkingId'
});
db.ParkingCapacity.belongsTo(db.Capacity, {
    foreignKey: 'capacityId'
});

//parking capacity association
db.VechicleTypeCapacity.belongsTo(db.Capacity), {
    foreignKey: 'capacityId'
}


//capacity rate
db.CapacityRate.belongsTo(db.Rate), {
    foreignKey: 'rateId'
}

db.CapacityRate.belongsTo(db.Capacity), {
    foreignKey: 'capacityId'
}

db.sequelize.sync({force: false});

export default db;

