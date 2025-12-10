import { DataTypes } from 'sequelize';
import { getDatabase } from '../database.js';

let Psychiatrist = null;

const getPsychiatrist = () => {
  if (Psychiatrist) return Psychiatrist;

  try {
    const sequelize = getDatabase();
    if (!sequelize) return null;

    Psychiatrist = sequelize.define('Psychiatrist', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      specialization: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      experience: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      consultationFee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      bio: {
        type: DataTypes.TEXT,
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
      availability: {
        type: DataTypes.JSON,
      },
    }, {
      tableName: 'psychiatrists',
      timestamps: true,
    });
  } catch (error) {
    console.error('Error defining Psychiatrist model:', error.message);
  }

  return Psychiatrist;
};

export default getPsychiatrist();
