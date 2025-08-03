const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PRICE_CHANGE_PERCENT = 0.1; 
const ACTIVE_USER_THRESHOLD = 5; 

const adjustVehiclePrices = async () => {
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

  const activeUserGroups = await prisma.userActivity.groupBy({
    by: ['userId'],
    where: {
      accessedAt: {
        gte: twelveHoursAgo,
      },
    },
  });

  const activeUserCount = activeUserGroups.length;

  const vehicles = await prisma.vehicle.findMany();

  for (const vehicle of vehicles) {
    let newRate = vehicle.rate;

    if (activeUserCount >= ACTIVE_USER_THRESHOLD) {
      newRate = vehicle.rate * (1 + PRICE_CHANGE_PERCENT); 
    } else {
      newRate = vehicle.rate * (1 - PRICE_CHANGE_PERCENT); 
    }

    newRate = Math.round(newRate * 100) / 100;

    if (newRate !== vehicle.rate) {
      await prisma.vehicle.update({
        where: { id: vehicle.id },
        data: { rate: newRate },
      });
    }
  }

  console.log(`Prices adjusted. Active users in last 12h: ${activeUserCount}`);
};

module.exports = adjustVehiclePrices;
