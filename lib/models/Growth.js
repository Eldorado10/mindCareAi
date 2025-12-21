import { DataTypes } from 'sequelize';
import { getDatabase } from '../database.js';

let Growth = null;

const getGrowth = () => {
  if (Growth) return Growth;

  try {
    const sequelize = getDatabase();
    if (!sequelize) return null;

    Growth = sequelize.define('Growth', {
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Growth title or milestone',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Detailed description of growth or progress',
      },
      category: {
        type: DataTypes.ENUM('personal', 'emotional', 'professional', 'health', 'relationships', 'other'),
        defaultValue: 'personal',
      },
      progressPercentage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 100,
        },
      },
      detectedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'When growth was detected from chatbot conversation',
      },
    }, {
      tableName: 'growths',
      timestamps: true,
    });
  } catch (error) {
    console.error('Error defining Growth model:', error.message);
  }

  return Growth;
};

export default getGrowth;
