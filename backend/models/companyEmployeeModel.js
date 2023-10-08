const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const companyEmployeeSchema = new mongoose.Schema({
    employeeID:
    {
        type: Number,
        required: [true, 'Employee ID is required'],
        unique: true,
    },
    employeeName: {
        type: String,
        trim: true,
        required: [true, 'Company Name is required'],
        maxlength: 70,
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'e-mail is required'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
    },
    companyID: {
        type: Number,
        required: true
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model("Company_Employee", companyEmployeeSchema);