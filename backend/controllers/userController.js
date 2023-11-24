const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');

//load all users
exports.allUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }).select('-password');
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        return next(new ErrorResponse(error.message, 500));
    }
}


//approve user
exports.approveAccess = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return next(new ErrorResponse(error.message, 500));
    }
}


//show single user
exports.searchUsers = async (req, res, next) => {
    try {
        const query = req.query.q; 
        const regex = new RegExp(query, 'i');
        const users = await User.find({
            $or: [
                { firstName: regex },
                { lastName: regex },
                { email: regex }
            ]
        }).select('-password');

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        return next(new ErrorResponse(error.message, 500));
    }
}



//edit user
exports.editUser = async (req, res, next) => {
    try {
        // Remove fields that shouldn't be edited
        delete req.body.email;
        delete req.body.password;

        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return next(new ErrorResponse(error.message, 500));
    }
}


//delete user
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id);
        res.status(200).json({
            success: true,
            message: "user deleted"
        })
        next();

    } catch (error) {
        return next(error);
    }
}