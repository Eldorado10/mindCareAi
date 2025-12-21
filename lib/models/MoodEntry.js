import { DataTypes } from 'sequelize';
import { getDatabase } from '../database.js';

let MoodEntry = null;

const getMoodEntry = () => {
  if (MoodEntry) return MoodEntry;

  try {
    const sequelize = getDatabase();
    if (!sequelize) return null;

    MoodEntry = sequelize.define('MoodEntry', {
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
      moodLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 10,
        },
        comment: 'Mood level from 1 (worst) to 10 (best)',
      },
      moodLabel: {
        type: DataTypes.ENUM('terrible', 'bad', 'poor', 'okay', 'good', 'great', 'excellent'),
        allowNull: false,
      },
      problem: {
        type: DataTypes.TEXT,
        comment: 'Description of current problem or concern',
      },
      improvement: {
        type: DataTypes.TEXT,
        comment: 'Positive changes or improvements noted',
      },
      notes: {
        type: DataTypes.TEXT,
        comment: 'Additional notes about the mood entry',
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'mood_entries',
      timestamps: true,
    });
  } catch (error) {
    console.error('Error defining MoodEntry model:', error.message);
  }

  return MoodEntry;
};

export default getMoodEntry;
