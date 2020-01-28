import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

// Models
import User from '../app/models/User';

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    const connection = new Sequelize(databaseConfig);
    models.map(model => model.init(connection));
  }
}

export default new Database();
