import { DataTypes } from 'sequelize';
import { getDatabase } from '../database.js';

let Improvement = null;

const getImprovement = () => {
  if (Improvement) return Improvement;

  try {
    const sequelize = getDatabase();
    if (!sequelize) return null;

    Improvement = sequelize.define('Improvement', {
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
      previousState: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Description of previous state or condition',
      },
      currentState: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Description of current improved state',
      },
      improvementArea: {
        type: DataTypes.ENUM('mood', 'anxiety', 'stress', 'sleep', 'relationships', 'work', 'health', 'confidence', 'other'),
        allowNull: false,
      },
      improvementLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        validate: {
          min: 1,
          max: 10,
        },
        comment: 'How much improvement (1-10)',
      },
      detectedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'improvements',
      timestamps: true,
    });
  } catch (error) {
    console.error('Error defining Improvement model:', error.message);
  }

  return Improvement;
};

export default getImprovement;
