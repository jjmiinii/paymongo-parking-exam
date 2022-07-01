import db from '../models/';

//const VehicleType = db.vehicle_types;

const TodoController = {
    create: async (req, res)  => {

        return res.status(200).send('Hello World Create');
    },
    read: async (req ,res) => {
        let vehicleType = await VehicleType.findAll({});

        console.log(vehicleType)
        return res.status(200).send(vehicleType);
    },
    update: async (req, res)  => {
        return res.status(200).send('Hello World Update');
    },
    delete: async (req, res)  => {
        return res.status(200).send('Hello World Delete');
    },
}

export default TodoController;