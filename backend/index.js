const express = require('express');
const app = express();
const cors = require('cors');

const homeRoutes = require('./routes/home.routes');

const { connectToDB } = require('./config/connectToDB');
const firebaseInit = require('./config/firebaseInitialize');

require('dotenv').config();



// connections
connectToDB();
firebaseInit();


// Middleware
app.use(express.json());
app.use(cors());


// Routes
app.use("/", homeRoutes);



app.listen(3000);