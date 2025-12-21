import { DataTypes } from 'sequelize';
import { getDatabase } from '../database.js';

let HealthData = null;

const getHealthData = () => {
  if (HealthData) return HealthData;

  try {
    const sequelize = getDatabase();
    if (!sequelize) return null;

    HealthData = sequelize.define('HealthData', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      condition: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Health condition (e.g., anxiety, depression, stress)',
      },
      severity: {
        type: DataTypes.ENUM('mild', 'moderate', 'severe'),
        defaultValue: 'mild',
      },
      description: {
        type: DataTypes.TEXT,
        comment: 'Detailed description of health condition',
      },
      treatmentStartDate: {
        type: DataTypes.DATE,
        comment: 'Date when treatment started',
      },
      lastUpdated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM('active', 'in-remission', 'resolved'),
        defaultValue: 'active',
      },
    }, {
      tableName: 'health_data',
      timestamps: true,
    });
  } catch (error) {
    console.error('Error defining HealthData model:', error.message);
  }

  return HealthData;
};

export default getHealthData;
