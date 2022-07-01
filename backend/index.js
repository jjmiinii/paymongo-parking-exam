import transactionRouter from './routes/transctions';
import express from 'express';
import bodyParser from 'body-parser';

const PORT = 4000;
const app = express();

// parse application/json
app.use(bodyParser.json())

//routers
app.use('/v1/transactions', transactionRouter);
console.log ('===== ROUTERG HAS BEEN LOADED =====');

//port listen
app.listen(PORT);
console.log(`===== RUNNING AT PORT ${PORT} =====`);
