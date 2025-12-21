import { DataTypes } from 'sequelize';
import { getDatabase } from '../database.js';

let Resource = null;

const getResource = () => {
  if (Resource) return Resource;

  try {
    const sequelize = getDatabase();
    if (!sequelize) return null;

    Resource = sequelize.define('Resource', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      icon: {
        type: DataTypes.STRING,
      },
      color: {
        type: DataTypes.STRING,
        defaultValue: 'blue',
      },
      features: {
        type: DataTypes.JSON,
      },
    }, {
      tableName: 'resources',
      timestamps: true,
    });
  } catch (error) {
    console.error('Error defining Resource model:', error.message);
  }

  return Resource;
};

export default getResource;
