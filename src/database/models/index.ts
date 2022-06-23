import { Sequelize } from 'sequelize';
// import * as config from '../config/database';
const config = require('../config/database');

export default new Sequelize(config);
