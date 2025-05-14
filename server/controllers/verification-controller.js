const User = require("../models/User");
const Verification = require("../models/Verification");
const nodemailer = require("nodemailer");


// verify code in email with account
const verifyEmail = async (req, res) => {
    try {
        const { code } = req.body;

        if(!code){
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code ! Please try again'
            })
        }

        //find user with this code
        const verification = await Verification.findOne({code: code });

        if(!verification){
            return res.status(400).json({
                success: false,
                message: 'User not found ! Please try again'
            })
        }

        const email = verification.email; 

        // update user to mark as verified
        const user = await User.findOneAndUpdate(
            { email },
            { isVerified: true }, 
            { new: true }
        );

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found!",
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Email verified successfully!',
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error! Please try again.",
        });
    }
}

// send code controller
const sendCode = async (req, res) => {
    try {
        const {email} = req.body;

        //create code
        const createdCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
       
        //create verification
        const newVerification = new Verification({
            email: email,
            code: createdCode,
        });

        await newVerification.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Booking Skin" <${process.env.EMAIL_USERNAME}>`,
            to: email,
            subject: "Booking Skin Email Verification",
            text: `Your verification code is ${createdCode}`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "Verification code sent successfully!",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error! Please try again.",
        })  
    }
}

// send code again controller
const sendCodeAgain = async (req, res) => {
    try {
        const {email} = req.query;

        //create code
        const createdCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
       
        //create verification
        const newVerification = new Verification({
            email: email,
            code: createdCode,
        });

        await newVerification.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Booking Skin" <${process.env.EMAIL_USERNAME}>`,
            to: email,
            subject: "Booking Skin Email Verification",
            text: `Your verification code is ${createdCode}`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "Verification code sent successfully!",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error! Please try again.",
        })  
    }
}

module.exports = {
    verifyEmail, 
    sendCode,
    sendCodeAgain,
}