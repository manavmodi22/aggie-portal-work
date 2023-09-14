const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');



exports.signup = async (req, res, next) => {
    const {email} = req.body;
    const userExist = await User.findOne({email});
    if (userExist) {
        return res.status(403).json({
            error: "Email is taken!"
        });
    }
    try{
        const user = User.create(req.body);
        res.status(201).json({
            message: "Signup success! Please signin."
        });
    }
    catch (error){
        next(error);
    }
}