import { DataTypes } from 'sequelize';
import { getDatabase } from '../database.js';

let EmergencyTeam = null;

const getEmergencyTeam = () => {
  if (EmergencyTeam) return EmergencyTeam;

  try {
    const sequelize = getDatabase();
    if (!sequelize) return null;

    EmergencyTeam = sequelize.define('EmergencyTeam', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      region: { type: DataTypes.STRING, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    }, { tableName: 'EmergencyTeams' });
  } catch (error) {
    console.error('Error defining EmergencyTeam model:', error.message);
  }

  return EmergencyTeam;
};

export default getEmergencyTeam;
