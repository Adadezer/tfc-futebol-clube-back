import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';

class User extends Model {
  public id!: number; // exclamação pra dizer q o atributo é obrigatório

  public username!: string;

  public role!: string;

  public email!: string;

  public password!: string;
}

User.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER,
  },
  username: {
    type: STRING,
    allowNull: false,
  },
  role: {
    type: STRING,
    allowNull: false,
  },
  email: {
    type: STRING,
    allowNull: false,
  },
  password: {
    type: STRING,
    allowNull: false,
  },
}, {
  underscored: true,
  timestamps: false,
  sequelize: db,
  modelName: 'User',
  tableName: 'users',
});

export default User;
