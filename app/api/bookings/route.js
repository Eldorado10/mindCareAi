import { getDatabase } from '@/lib/database.js';
import getBooking from '@/lib/models/Booking.js';
import getPsychiatrist from '@/lib/models/Psychiatrist.js';

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

    const Booking = getBooking();
    const Psychiatrist = getPsychiatrist();

    if (!Booking || !Psychiatrist) {
      return Response.json({ error: 'Models unavailable' }, { status: 503 });
    }

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
    console.error('[API] Bookings GET Error:', error);
    return Response.json({
      error: error.message,
      debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const sequelize = getDatabase();
    if (!sequelize) {
      return Response.json({ error: 'Database not initialized' }, { status: 503 });
    }
    
    await sequelize.authenticate();
    
    const Booking = getBooking();
    const Psychiatrist = getPsychiatrist();

    if (!Booking || !Psychiatrist) {
      return Response.json({ error: 'Models unavailable' }, { status: 503 });
    }

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
    console.error('[API] Bookings POST Error:', error);
    return Response.json({
      error: error.message,
      debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
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

    if (!id) {
      return Response.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    const Booking = getBooking();
    const Psychiatrist = getPsychiatrist();

    if (!Booking || !Psychiatrist) {
      return Response.json({ error: 'Models unavailable' }, { status: 503 });
    }

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
    console.error('[API] Bookings PUT Error:', error);
    return Response.json({
      error: error.message,
      debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
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

    if (!id) {
      return Response.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    const Booking = getBooking();
    if (!Booking) {
      return Response.json({ error: 'Booking model unavailable' }, { status: 503 });
    }

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    await booking.destroy();
    return Response.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('[API] Bookings DELETE Error:', error);
    return Response.json({
      error: error.message,
      debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}
