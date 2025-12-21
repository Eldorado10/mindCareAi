import { DataTypes } from 'sequelize';
import { getDatabase } from '../database.js';

let EmergencyAlert = null;

const getEmergencyAlert = () => {
  if (EmergencyAlert) return EmergencyAlert;

  try {
    const sequelize = getDatabase();
    if (!sequelize) return null;

    EmergencyAlert = sequelize.define('EmergencyAlert', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      riskLevel: { type: DataTypes.STRING, allowNull: false },
      isHeavy: { type: DataTypes.BOOLEAN, defaultValue: false },
      excerpt: { type: DataTypes.TEXT, allowNull: false },
      fullText: { type: DataTypes.TEXT, allowNull: false },
      status: { type: DataTypes.STRING, defaultValue: 'new' },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    }, { tableName: 'EmergencyAlerts' });
  } catch (error) {
    console.error('Error defining EmergencyAlert model:', error.message);
  }

  return EmergencyAlert;
};

export default getEmergencyAlert;
