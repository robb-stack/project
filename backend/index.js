const express = require('express');
const cors = require('cors');
const app = express();
const userRoute = require('./routes/userRoute');
const vehicleRoute = require('./routes/vehicleRoute');
const bookingRoute = require('./routes/bookingRoute');
const path = require('path');

PORT = 8000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/user', userRoute);
app.use('/vehicle', vehicleRoute);
app.use('/booking', bookingRoute);
app.get('/', (req, res) => {
    res.send("The server is working properly");
})

app.listen(PORT, () => {
    console.log("Listening to port 8000");
})