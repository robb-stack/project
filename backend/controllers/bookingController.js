const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createBooking = async (req, res) => {
  const { userId, vehicleId, status } = req.body;

  try {
    const existingBooking = await prisma.booking.findUnique({
      where: {
        userId_vehicleId: {
          userId: parseInt(userId),
          vehicleId: parseInt(vehicleId),
        },
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        status: 'error',
        message: 'Booking already exists for this vehicle by this user.',
      });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: parseInt(userId),
        vehicleId: parseInt(vehicleId),
        status: status || 'pending',
      },
    });

    res.status(201).json({
      status: 'success',
      data: booking,
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong while creating the booking.',
      error: error.message,
    });
  }
};


exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        vehicle: true,
      },
    });
    res.json({ status: "success", data: bookings });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};



exports.approveBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await prisma.booking.update({
      where: { id: Number(id) },
      data: { status: "confirmed" },
    });
    res.json({ status: "success", data: updated });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.denyBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: {
        status: "denied",
      },
      include: {
        user: true,
        vehicle: true,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Booking denied",
      data: booking,
    });
  } catch (error) {
    console.error("Error denying booking:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to deny booking",
    });
  }
};

exports.getUserBookings = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        vehicle: true,
      },
    });
    res.status(200).json({ status: "success", data: bookings });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};