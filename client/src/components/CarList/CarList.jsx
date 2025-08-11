import React, { useEffect, useState } from "react";
import axios from "axios";

const CarList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null); // for payment
  const [days, setDays] = useState(1);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

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

  const handleBookNowClick = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const onSubmitPayment = async () => {
    if (!user) {
      alert("Please log in to book a vehicle.");
      return;
    }

    if (!cardNumber || !expiry || !cvv || days <= 0) {
      alert("Please fill all payment details correctly.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/booking", {
        userId: user.id,
        vehicleId: selectedVehicle.id,
        status: "pending",
        days: days,
      });

      alert("Payment successful! Booking request sent. Await confirmation.");
      const res = await axios.get(`http://localhost:8000/booking/user/${user.id}`);
      setUserBookings(res.data.data);
      setSelectedVehicle(null);
      setCardNumber("");
      setExpiry("");
      setCvv("");
      setDays(1);
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
        <h1 className="text-3xl sm:text-4xl font-semibold font-serif mb-3">
          Book Your Ride Now
        </h1>
        <p className="text-sm pb-10">
          Choose your car, pick your dates, and hit the road – it’s that easy.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
          {vehicles.map((car, index) => (
            <div
              key={car.id}
              className="space-y-3 border-2 border-gray-300 hover:border-primary p-3 rounded-xl relative group"
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
                  <p>Rs. {car.adjustedRate}/Day</p>
                  {isBooked(car.id) ? (
                    <span className="text-gray-500 text-sm">Booked</span>
                  ) : (
                    <button
                      onClick={() => handleBookNowClick(car)}
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

        {selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[350px]">
              <h2 className="text-lg font-bold mb-4">
                Payment for {selectedVehicle.name}
              </h2>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  CVV
                </label>
                <input
                  type="password"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Number of Days
                </label>
                <input
                  type="number"
                  placeholder="Enter number of days"
                  value={days}
                  min={1}
                  onChange={(e) => setDays(e.target.value)}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={onSubmitPayment}
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  Pay & Book
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CarList;
