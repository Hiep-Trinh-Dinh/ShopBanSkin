const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const routes = require('./routes');  
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3001;

// Cấu hình CORS cho phép frontend từ localhost:5173 và chia sẻ cookie
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
  
app.use(bodyParser.json());
app.use(cookieParser());

// Khai báo thư mục public
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// API routes
app.use('/api', routes);

// Serve frontend khi ở môi trường production
if (process.env.NODE_ENV === 'production') {
  // Serve tệp tĩnh của React app từ thư mục build
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Xử lý tất cả các routes khác
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

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