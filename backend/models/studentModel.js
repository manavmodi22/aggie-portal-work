const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const studentSchema = new mongoose.Schema({
    studentID:
    {
        type: Number,
        required: [true, 'Student ID is required'],
        unique: true,
    },
    studentName: {
        type: String,
        trim: true,
        required: [true, 'Student Name is required'],
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
    major:
    {
        type: String,
        unique: true,
    },
    degree:
    {
        type: String,
        unique: true,
    },
    skills: [String],
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model("Student", studentSchema);