import { DataTypes } from 'sequelize';
import { getDatabase } from '../database.js';

let Booking = null;

const getBooking = () => {
  if (Booking) return Booking;

  try {
    const sequelize = getDatabase();
    if (!sequelize) return null;

    Booking = sequelize.define('Booking', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      psychiatristId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      bookingDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      timeSlot: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        defaultValue: 'pending',
      },
      notes: {
        type: DataTypes.TEXT,
      },
    }, {
      tableName: 'bookings',
      timestamps: true,
    });
  } catch (error) {
    console.error('Error defining Booking model:', error.message);
  }

  return Booking;
};

export default getBooking;
