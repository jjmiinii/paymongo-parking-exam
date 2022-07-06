import _ from 'lodash'
import { Op } from 'sequelize';
import  db  from '../models/';
import helper from '../Utils/helpers';


/**
 * @class BaseService
 */
export default class BaseRepository {

    constructor() {
        this.helper = helper;
        this.db = db;
        this._ = _;
        this.Op = Op;
    }

    create = async({body = {}, Model }) => {
        return new Promise(async (resolve, reject) => {
            const data = await Model.create({
                ...body
            })
            resolve(data);
        })
    }

    readAll = async({queryParams = {}, Model}) => {
        return new Promise(async(resolve, reject) =>{
            const data = await Model.findAll({
                where: {
                    ...queryParams
                }
            })
        })
    }

    readOne = async({queryParams = {}, Model}) => {
        return new Promise(async(resolve, reject) =>{
            const data = await Model.findOne({
                where: {
                    ...queryParams
                }
            })
            resolve(data);
        })
    }
}
