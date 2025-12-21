import { DataTypes } from 'sequelize';
import { getDatabase } from '../database.js';

let HealthCondition = null;

const getHealthCondition = () => {
  if (HealthCondition) return HealthCondition;

  try {
    const sequelize = getDatabase();
    if (!sequelize) return null;

    HealthCondition = sequelize.define('HealthCondition', {
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
        comment: 'Name of the health condition',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Detailed description of the condition',
      },
      severity: {
        type: DataTypes.ENUM('mild', 'moderate', 'severe'),
        defaultValue: 'moderate',
        comment: 'Severity level of the condition',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'resolved', 'monitoring'),
        defaultValue: 'active',
        comment: 'Current status of the condition',
      },
      treatmentStartDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'When treatment started',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional notes about the condition',
      },
      recordedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'When this record was created',
      },
    }, {
      tableName: 'health_conditions',
      timestamps: true,
    });
  } catch (error) {
    console.error('Error defining HealthCondition model:', error.message);
  }

  return HealthCondition;
};

export default getHealthCondition;
