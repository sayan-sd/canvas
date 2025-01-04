const express = require('express');
const app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');

const authRoutes = require('./routes/auth.routes');
const editorRoutes = require('./routes/editor.routes');
const blogRoutes = require('./routes/blogs.routes');

const { connectToDB } = require('./config/connectToDB');
const firebaseInit = require('./config/firebaseInitialize');
const { cloudinaryConnect } = require('./config/cloudinary');

require('dotenv').config();



// connections
connectToDB();
firebaseInit();
cloudinaryConnect();


// Middleware
app.use(express.json());
app.use(cors());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "./tmp/" }));


// Routes
app.use("/", authRoutes);
app.use("/editor", editorRoutes);
app.use("/blogs", blogRoutes);



app.listen(3000);