﻿# ShopBanSkin

ShopBanSkin là nền tảng mua bán skin game trực tuyến, cho phép người dùng đăng tin, giao dịch, và quản lý skin game một cách an toàn và tiện lợi.

## 📋 Tổng quan

ShopBanSkin là một ứng dụng web fullstack sử dụng MERN stack (MongoDB, Express, React, Node.js), cho phép:
- Đăng ký, đăng nhập và quản lý tài khoản người dùng
- Xác thực email và khôi phục mật khẩu
- Xem, tìm kiếm và mua skin game
- Nạp tiền vào tài khoản
- Đăng tin bán skin
- Quản lý giao dịch và theo dõi lịch sử
- Giao diện quản trị cho admin

## 🚀 Các tính năng chính

- **Xác thực**: Đăng ký, đăng nhập, JWT, refresh token
- **Quản lý tài khoản**: Thay đổi thông tin cá nhân, mật khẩu, avatar
- **Quản lý sản phẩm**: Xem, thêm, sửa, xóa skin game
- **Giao dịch**: Nạp tiền, mua skin, theo dõi lịch sử giao dịch
- **Cộng đồng**: Đăng bài, tương tác với cộng đồng
- **Quản trị**: Quản lý người dùng, sản phẩm, bài đăng và giao dịch

## 🛠️ Công nghệ sử dụng

### Frontend
- React.js + Vite
- Redux Toolkit (quản lý state)
- React Router (định tuyến)
- Tailwind CSS (UI)
- Axios (API calls)
- React Query (quản lý data fetching)

### Backend
- Node.js
- Express.js
- MongoDB (cơ sở dữ liệu)
- JWT (xác thực)
- Cloudinary (lưu trữ hình ảnh)
- Nodemailer (gửi email)

## 📦 Cài đặt và Chạy dự án

### Yêu cầu hệ thống
- Node.js (v14 trở lên)
- npm hoặc yarn
- MongoDB (cài đặt cục bộ hoặc MongoDB Atlas)

### Cài đặt dự án

1. Clone repository:
```bash
git clone https://github.com/your-username/ShopBanSkin.git
cd ShopBanSkin
```

2. Cài đặt dependencies cho cả frontend và backend:
```bash
# Cài đặt dependencies cho server
npm install

# Cài đặt dependencies cho client
cd client
npm install
cd ..
```

3. Thiết lập biến môi trường:

Tạo file `.env` trong thư mục server với nội dung:
```
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret
EMAIL_USERNAME=your_email_for_sending
EMAIL_PASSWORD=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Tạo file `.env` trong thư mục client với nội dung:
```
VITE_API_KEY=/api
```

### Chạy dự án (development)

1. Chạy cả frontend và backend cùng lúc:
```bash
npm run dev
```

Hoặc chạy riêng biệt:

2. Chạy backend:
```bash
npm run server
```

3. Chạy frontend:
```bash
npm run client
```

Ứng dụng sẽ chạy tại:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 🚢 Triển khai (Deployment)

### Triển khai lên Render

1. Đăng ký tài khoản tại [Render](https://render.com)
2. Tạo Web Service mới và liên kết với GitHub repository
3. Sử dụng cấu hình sau:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Thiết lập biến môi trường tương tự như trong file `.env` server
5. Deploy và truy cập tại URL được cung cấp bởi Render (link:https://shopbanskin.onrender.com)

## 📁 Cấu trúc thư mục

```
ShopBanSkin/
├── client/                 # Frontend React app
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # React components
│       ├── redux/          # Redux store and slices
│       ├── services/       # API services
│       └── utils/          # Utility functions
├── server/                 # Backend Node.js
│   ├── config/             # Server configuration
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Express middlewares
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── server.js           # Main server file
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## 👥 Đóng góp

Mọi đóng góp đều được hoan nghênh. Hãy tạo pull request hoặc báo cáo issues nếu bạn phát hiện lỗi.

## 📄 Giấy phép

Dự án được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.
