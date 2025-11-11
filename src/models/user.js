import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  verificationToken: {
  type: DataTypes.STRING
  },
  passwordChangeToken: {
  type: DataTypes.STRING
  },
  start_date: {
  type: DataTypes.DATE,
  allowNull: false
  },
  department: {
  type: DataTypes.STRING,
  allowNull: false
  },
  job_title: {
  type: DataTypes.STRING,
  allowNull: false
  },
  employment_id: {
  type: DataTypes.STRING,
  unique: true,
  allowNull: false
  },
  profile_picture: {
  type: DataTypes.STRING // store file path or URL
  }
});

export default User;