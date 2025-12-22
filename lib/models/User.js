import { DataTypes } from 'sequelize';
import { getDatabase } from '../database.js';

let User = null;

const getUser = () => {
  if (User) return User;

  try {
    const sequelize = getDatabase();
    if (!sequelize) return null;

    User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'patient',
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
      },
      specialization: {
        type: DataTypes.STRING,
      },
      bio: {
        type: DataTypes.TEXT,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    }, {
      tableName: 'users',
      timestamps: true,
    });
  } catch (error) {
    console.error('Error defining User model:', error.message);
  }

  return User;
};

export default getUser;
