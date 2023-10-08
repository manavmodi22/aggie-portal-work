const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;


const companySchema = new mongoose.Schema({
    companyID:
    {
        type: Number,
        required: [true, 'Company ID is required'],
        unique: true,
    },
    companyName: {
        type: String,
        trim: true,
        required: [true, 'Company Name is required'],
        maxlength: 70,
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Description is required'],
    },
    location: {
        type: String,
    },
    // available: {
    //     type: Boolean,
    //     default: true
    // },
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model("Company", companySchema);