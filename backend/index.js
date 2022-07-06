import transactionRouter from './routes/transctions';
import parkingCapacity from './routes/parkingCapacity';
import vehicleTypeRouter from './routes/vehicleType';
import parkingRouter from './routes/parking';
import express from 'express';
import bodyParser from 'body-parser';

const PORT = 4000;
const app = express();

// parse application/json
app.use(bodyParser.json())

//routers
app.use('/v1/transactions', transactionRouter);
app.use('/v1/parkingCapacities', parkingCapacity);
app.use('/v1/vehicleTypes', vehicleTypeRouter);
app.use('/v1/parkings', parkingRouter);
console.log ('===== ROUTERG HAS BEEN LOADED =====');

//port listen
app.listen(PORT);
console.log(`===== RUNNING AT PORT ${PORT} =====`);
