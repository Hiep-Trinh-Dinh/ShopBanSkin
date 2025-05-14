const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token){
            return res.status(401).json({
                success: false,
                message: 'Unauthorized ! Please login to continue !'
            })
        }

        //decode this token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Unauthorized ! Please login to continue !'
            })
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = authMiddleware