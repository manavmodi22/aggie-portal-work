const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
const mailgunDomain = process.env.MAILGUN_DOMAIN;
const crypto = require('crypto');

// Function to send verification email
const sendEmail = async (to, subject, text, html) => {
    try {
        const response = await mg.messages.create(mailgunDomain, {
            from: "Excited User <mailgun@sandbox-123.mailgun.org>",
            to: [to],
            subject,
            text,
            html,
        });
        console.log('Email sent successfully', response.data);
    } catch (error) {
        console.error('An error occurred while sending the email', error);
    }
}

// Signup logic with email verification
exports.signup = async (req, res, next) => {
    const { email, firstName, lastName, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist && userExist.status !== 'pending') {
        return next(new ErrorResponse("E-mail already registered. If you think this is an error, please contact the system admin.", 400));
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            firstName,
            lastName,
            password: hashedPassword,
        });

        if (!user) {
            return next(new ErrorResponse("User registration failed", 500));
        }

        const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
        user.code = verificationCode;
        user.verificationCodeExpire = Date.now() + 100 * 60 * 1000; // 10 minutes from now
        await user.save();
        console.log('Verification code:', verificationCode);
        console.log('Verification code expires at:', user.verificationCodeExpire);

        // Email subject and body for code
        const emailSubject = `Verify your Email, ${firstName}`;
        const emailText = `Thank you for signing up with Aggies in Tech. Please enter this code to verify your email: ${verificationCode}`;
        const emailHTML = `<p>Thank you for signing up with Aggies in Tech. Please enter this code to verify your email:</p><strong>${verificationCode}</strong>`;

        // Send the verification email
        await sendEmail(user.email, emailSubject, emailText, emailHTML);

        // Send a response indicating successful signup
        res.status(201).json({ success: true, message: 'User registered successfully. Please enter the verification code sent to your email.' });
    } catch (error) {
        next(error);
    }
};

exports.verifyCode = async (req, res, next) => {
    const { email, code } = req.body;
    console.log(req.body);
    // console.log("test-check:",verificationCode1);
    // Check if email and code are present in the request
    if (!email || !code) {
        return next(new ErrorResponse("Email and code are required", 400));
    }

    const user = await User.findOne({ email });
    

    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    if (user.code !== code) {
        return next(new ErrorResponse("Invalid code", 400));
    }

    // if (user.verificationCodeExpire <= Date.now()) {
    //     return next(new ErrorResponse("Code has expired", 400));
    // }

    // At this point, both the verification code is valid, and it hasn't expired.
    user.status = 'emailVerified';
    user.code = undefined;
    //user.verificationCodeExpire = undefined;
    await user.save();
    res.status(200).json({ success: true, message: 'Email verified successfully' });
};


exports.signin = async (req, res, next) => {

    try {
        const { email, password } = req.body;
        //validation
        if (!email) {
            return next(new ErrorResponse("please add an email", 403));
        }
        if (!password) {
            return next(new ErrorResponse("please add a password", 403));
        }

        //check user email
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse("invalid credentials", 400));
        }
        //check password
        const isMatched = await user.comparePassword(password);
        if (!isMatched) {
            return next(new ErrorResponse("invalid credentials", 400));
        }

        sendTokenResponse(user, 200, res);

    } catch (error) {
        next(error);
    }
}

const sendTokenResponse = async (user, codeStatus, res) => {
    const token = await user.getJwtToken();
    res
        .status(codeStatus)
        .cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true })
        .json({ success: true, token, user })
}


// log out
exports.logout = (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "logged out"
    })
}


// user profile
exports.userProfile = async (req, res, next) => {

    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json({
        success: true,
        user
    })
}