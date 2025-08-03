import React, { useEffect, useState } from "react";
import axios from "axios";

const CarList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [userBookings, setUserBookings] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios.get(`http://localhost:8000/vehicle?userId=${user?.id}`)
      .then(res => setVehicles(res.data.data))
      .catch(err => console.error("Error fetching vehicles:", err));

    if (user) {
      axios.get(`http://localhost:8000/booking/user/${user.id}`)
        .then(res => setUserBookings(res.data.data))
        .catch(err => console.error("Error fetching bookings:", err));
    }
  }, []);

  const handleBookNow = async (vehicleId) => {
    if (!user) {
      alert("Please log in to book a vehicle.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/booking", {
        userId: user.id,
        vehicleId,
        status: "pending",
      });

      alert("Booking request sent! Await confirmation.");
      // Refresh bookings
      const res = await axios.get(`http://localhost:8000/booking/user/${user.id}`);
      setUserBookings(res.data.data);
    } catch (err) {
      alert("Booking failed. You may have already booked this vehicle.");
      console.error(err);
    }
  };

  const isBooked = (vehicleId) => {
    return userBookings.some(b => b.vehicleId === vehicleId && b.status !== "denied");
  };

  return (
    <div className="pb-24">
      <div className="container">
        <h1 className="text-3xl sm:text-4xl font-semibold font-serif mb-3" data-aos="fade-up">
          Book Your Ride Now
        </h1>
        <p className="text-sm pb-10" data-aos="fade-up" data-aos-delay="400">
          Choose your car, pick your dates, and hit the road – it’s that easy.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
          {vehicles.map((car, index) => (
            <div
              key={car.id}
              className="space-y-3 border-2 border-gray-300 hover:border-primary p-3 rounded-xl relative group"
              data-aos="fade-up"
              data-aos-delay={index * 300}
            >
              <div className="w-full h-[120px]">
                <img
                  src={car.imageUrl}
                  alt={car.name}
                  className="w-full h-[120px] object-contain sm:translate-x-8 group-hover:sm:translate-x-16 duration-700"
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-primary font-semibold">{car.name}</h1>
                <div className="flex justify-between items-center text-xl font-semibold">
                  <p>Rs{car.rate}/Day</p>
                  {isBooked(car.id) ? (
                    <span className="text-gray-500 text-sm">Booked</span>
                  ) : (
                    <button
                      onClick={() => handleBookNow(car.id)}
                      className="text-sm px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark"
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xl font-semibold absolute top-0 left-3">
                {car.status}
              </p>
            </div>
          ))}
        </div>

        <div className="grid place-items-center mt-8">
          <button className="button-outline" data-aos="fade-up">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarList;
