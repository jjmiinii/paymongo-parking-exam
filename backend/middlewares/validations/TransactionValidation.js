import Joi from 'joi';

export default class TransactionValidation {
    constructor(){
        this.options = {
            abortEarly: false,
            stripUnknown: true
        }
    }
    validatePark = async(req, res, next) => {
        const schema = Joi.object().keys({
            plateNumber: Joi.string().required(),
            entryPoint: Joi.string().required(),
            vehicleTypeId: Joi.number().required() 
        })
        const { error } = schema.validate(req.body, { ...this.options })

        if(error){
           return res.status(422).json(error.details);
        }
        next();
    };
    validateUnPark = async(req, res, next) => {
        const schema = Joi.object().keys({
            plateNumber: Joi.string().required(),
        })  
        const { error } = schema.validate(req.body, { ...this.options })

        if(error){
           return res.status(422).json(error.details);
        }
        next();
    }
}