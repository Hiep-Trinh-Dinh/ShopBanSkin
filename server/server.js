const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const routes = require('./routes');  
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3001;

// Cấu hình CORS cho phép frontend từ localhost:5173 và chia sẻ cookie
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
  
app.use(bodyParser.json());
app.use(cookieParser());

routes(app);

mongoose.connect(process.env.MONGO_URI)
    .then(()=> {
        console.log('Database connection successful!')
    })
    .catch((err) => {
        console.error('Database connection error:', err)
    })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})