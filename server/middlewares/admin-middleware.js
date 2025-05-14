const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

const isAdminUser = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized! Token is missing.",
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
              return res.status(403).json({
                status: "ERROR",
                message: "Invalid or expired token.",
              });
            }
      
            console.log("Decoded Token:", decoded);
      
            // Kiểm tra quyền admin
            if (decoded.role !== "admin") {
              return res.status(403).json({
                status: "ERROR",
                message: "Access denied! Admin rights required.",
              });
            }
      
            // Gắn thông tin user vào request
            req.user = decoded;
      
            // Tiếp tục xử lý
            next();
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error ! Please try again !'
        })
    }
}

module.exports = isAdminUser