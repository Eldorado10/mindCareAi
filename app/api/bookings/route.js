import { getDatabase } from '@/lib/database.js';
import Booking from '@/lib/models/Booking.js';
import Psychiatrist from '@/lib/models/Psychiatrist.js';

export async function GET(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }
    
    await sequelize.authenticate();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userEmail = searchParams.get('userEmail');

    if (id) {
      const booking = await Booking.findByPk(id);
      if (!booking) {
        return Response.json({ error: 'Booking not found' }, { status: 404 });
      }
      // Fetch psychiatrist details
      if (booking.psychiatristId) {
        const psychiatrist = await Psychiatrist.findByPk(booking.psychiatristId);
        if (psychiatrist) {
          booking.dataValues.psychiatristName = psychiatrist.name;
          booking.dataValues.psychiatristSpecialization = psychiatrist.specialization;
        }
      }
      return Response.json(booking);
    }

    if (userEmail) {
      const bookings = await Booking.findAll({
        where: { userEmail },
        order: [['bookingDate', 'DESC']],
      });
      // Add psychiatrist details to each booking
      const bookingsWithPsych = await Promise.all(
        bookings.map(async (booking) => {
          if (booking.psychiatristId) {
            const psychiatrist = await Psychiatrist.findByPk(booking.psychiatristId);
            if (psychiatrist) {
              booking.dataValues.psychiatristName = psychiatrist.name;
              booking.dataValues.psychiatristSpecialization = psychiatrist.specialization;
            }
          }
          return booking;
        })
      );
      return Response.json(bookingsWithPsych);
    }

    const bookings = await Booking.findAll({
      order: [['bookingDate', 'DESC']],
    });
    
    // Add psychiatrist details to each booking
    const bookingsWithPsych = await Promise.all(
      bookings.map(async (booking) => {
        if (booking.psychiatristId) {
          const psychiatrist = await Psychiatrist.findByPk(booking.psychiatristId);
          if (psychiatrist) {
            booking.dataValues.psychiatristName = psychiatrist.name;
            booking.dataValues.psychiatristSpecialization = psychiatrist.specialization;
          }
        }
        return booking;
      })
    );
    
    return Response.json(bookingsWithPsych);
  } catch (error) {
    console.error('[API] GET Error:', error);
    return Response.json({ error: error.message, debug: error.toString() }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }
    
    await sequelize.authenticate();
    
    const data = await request.json();
    const booking = await Booking.create(data);
    
    // Fetch psychiatrist details
    if (booking.psychiatristId) {
      const psychiatrist = await Psychiatrist.findByPk(booking.psychiatristId);
      if (psychiatrist) {
        booking.dataValues.psychiatristName = psychiatrist.name;
        booking.dataValues.psychiatristSpecialization = psychiatrist.specialization;
      }
    }
    
    return Response.json(booking, { status: 201 });
  } catch (error) {
    console.error('[API] POST Error:', error);
    return Response.json({ error: error.message, debug: error.toString() }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }
    
    await sequelize.authenticate();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    await booking.update(data);
    
    // Fetch psychiatrist details
    if (booking.psychiatristId) {
      const psychiatrist = await Psychiatrist.findByPk(booking.psychiatristId);
      if (psychiatrist) {
        booking.dataValues.psychiatristName = psychiatrist.name;
        booking.dataValues.psychiatristSpecialization = psychiatrist.specialization;
      }
    }
    
    return Response.json(booking);
  } catch (error) {
    console.error('[API] PUT Error:', error);
    return Response.json({ error: error.message, debug: error.toString() }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }
    
    await sequelize.authenticate();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    await booking.destroy();
    return Response.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('[API] DELETE Error:', error);
    return Response.json({ error: error.message, debug: error.toString() }, { status: 500 });
  }
}
