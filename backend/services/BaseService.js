 import _ from 'lodash'
 import { Op } from 'sequelize';
 import  db  from '../models/';
 import helper from '../Utils/helpers'; 
 
 /**
  * @class BaseService
  */
 export default class BaseService {
 
     constructor() {
         this.helper = helper;
         this.db = db;
         this._ = _;
         this.Op = Op;
     }
 }