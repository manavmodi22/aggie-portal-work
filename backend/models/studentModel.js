const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const studentSchema = new mongoose.Schema(
  {
    studentID: {
      type: Number,
      required: [true, "Student ID is required"],
      unique: true,
    },
    studentName: {
      type: String,
      trim: true,
      required: [true, "Student Name is required"],
      maxlength: 70,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "e-mail is required"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
    },
    major: {
      type: String,
    },
    degree: {
      type: String,
    },
    skills: [String],
    summary: { type: String },
    portfolio: { type: String },
    linkedin: { type: String },
    github: { type: String },
    resume: {
      data: Buffer,
      contentType: String,
    },
    cohort: {
      type: Number,
      enum: [0, 1, 2, 3, 4],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Actively searching for Internships",
        "Passively searching for Internships",
        "Not searching for Internships",
        "Actively Searching for Full-Time Positions",
        "Not searching for Full-Time Positions",
        "Passively searching for Full-Time Positions",
        "Looking to go to Graduate School",
        "Employed Full Time",
      ],
      //required: true,
    },
    companiesAssociatedWith: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
