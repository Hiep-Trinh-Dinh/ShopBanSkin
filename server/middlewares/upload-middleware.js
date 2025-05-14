const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "booking-skin", // Thư mục trong Cloudinary để lưu tệp
        allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "avi"], // Các định dạng cho phép
        resource_type: "auto", // Tự động chọn loại tài nguyên (image/video)
    },
});

// Tích hợp với multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // Giới hạn kích thước tệp: 20MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only images and videos are allowed."));
        }
    },
});

module.exports = upload;