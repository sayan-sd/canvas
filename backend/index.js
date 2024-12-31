const express = require('express');
const app = express();
const cors = require('cors');

const homeRoutes = require('./routes/home.routes');

const { connectToDB } = require('./config/connectToDB');

require('dotenv').config();



// connections
connectToDB();


// Middleware
app.use(express.json());
app.use(cors());


// Routes
app.use("/", homeRoutes);



app.listen(3000);