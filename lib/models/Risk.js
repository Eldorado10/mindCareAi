import { DataTypes } from 'sequelize';
import { getDatabase } from '../database.js';

let Risk = null;

const getRisk = () => {
  if (Risk) return Risk;

  try {
    const sequelize = getDatabase();
    if (!sequelize) return null;

    Risk = sequelize.define('Risk', {
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
      riskLevel: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'low',
      },
      riskScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Numeric risk score from 1 (low) to 10 (critical)',
      },
      riskType: {
        type: DataTypes.ENUM('suicidal-ideation', 'self-harm', 'substance-abuse', 'crisis', 'other'),
        allowNull: false,
      },
      indicator: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'The specific indicator or statement that triggered risk detection',
      },
      actionTaken: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Action taken or resources provided to user',
      },
      detectedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'risks',
      timestamps: true,
    });
  } catch (error) {
    console.error('Error defining Risk model:', error.message);
  }

  return Risk;
};

export default getRisk;
