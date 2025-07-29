const express = require('express');
const cors = require('cors');
const app = express();
const userRoute = require('./routes/userRoute');
const userController = require('./controllers/userController');

PORT = 8000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/user', userRoute);
app.get('/', (req, res) => {
    res.send("The server is working properly");
})

app.listen(PORT, () => {
    console.log("Listening to port 8000");
})