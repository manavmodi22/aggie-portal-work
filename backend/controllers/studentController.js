const mongoose = require('mongoose');
const Student = require('../models/studentModel');
const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs');
const xlsx = require('xlsx');
const emailValidator = require('email-validator');



// Create a new student
exports.createStudent = async (req, res, next) => {
    try {
        const student = await Student.create({
            studentID: req.body.studentID,
            studentName: req.body.studentName,
            email: req.body.email,
            phone: req.body.phone,
            major: req.body.major,
            degree: req.body.degree,
            skills: req.body.skills,
            user: req.user.id
        });
        res.status(201).json({
            success: true,
            student
        })
    } catch (error) {
        return next(error);
    }
}


// exports.searchStudentsBySkills = async (req, res, next) => {
//     try {
//         const { skills, page = 1, perPage = 10 } = req.query;
//         if (!skills) {
//             return res.status(400).json({ error: 'Skills parameter is required' });
//         }

//         // Split the skills string by commas and trim whitespace
//         const skillList = skills.split(',').map(skill => skill.trim());

//         // Build a regex pattern to match any case and substring variations of the skills
//         const regexSkills = skillList.map(skill => new RegExp(skill.replace('.', '\\.'), 'i'));

//         // Calculate the skip value for pagination
//         const skip = (page - 1) * perPage;

//         // Use the $in operator with $or and $regex to find students with matching skills
//         const students = await Student.find({
//             $or: regexSkills.map(skill => ({ skills: { $regex: skill } })),
//         })
//             .sort({ skills: -1 }) // Sort by the number of matching skills in descending order
//             .skip(skip)
//             .limit(parseInt(perPage))
//             .exec();

//         res.json(students);
//     } catch (error) {
//         return next(error);
//     }
// };


exports.searchStudentsBySkills = async (req, res, next) => {
  try {
      const { skills, page = 1, limit = 10 } = req.query;
      if (!skills) {
          return res.status(400).json({ error: 'Skills parameter is required' });
      }

      const skillList = skills.split(',').map(skill => skill.trim());

      const regexSkills = skillList.map(skill => new RegExp(skill.replace('.', '\\.'), 'i'));

      const skip = (page - 1) * limit;

      const students = await Student.find({
          $or: regexSkills.map(skill => ({ skills: { $regex: skill } })),
      })
          .sort({ skills: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .exec();

      const totalStudents = await Student.find({
          $or: regexSkills.map(skill => ({ skills: { $regex: skill } })),
      }).countDocuments();

      res.status(200).json({
          success: true,
          students,
          currentPage: page,
          totalPages: Math.ceil(totalStudents / limit),
          totalStudents,
      });
  } catch (error) {
      return next(error);
  }
};

// Fetch student resume
exports.getStudentResume = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student || !student.resume || !student.resume.data) {
      return next(new ErrorResponse('Resume not found', 404));
    }

    // Set the content type to the resume's content type
    res.set('Content-Type', student.resume.contentType);

    // Send the resume data as a buffer
    res.send(student.resume.data);
  } catch (error) {
    console.error('Error in getStudentResume:', error);
    return next(new ErrorResponse('Error fetching student resume', 500));
  }
};

// Update student by MongoDB _id
exports.updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (!student) {
      return next(new ErrorResponse('Student not found', 404));
    }

    // Handle file upload
    if (req.file) {
      const resume = req.file;
      student.resume = {
        data: fs.readFileSync(resume.path),
        contentType: resume.mimetype
      };
  
      // Remove the file after saving to the database
      fs.unlinkSync(resume.path);
    }
  
    
    // Update other fields
    Object.entries(req.body).forEach(([key, value]) => {
      if (key !== 'resume') {
        student[key] = value;
      }
    });

    const updatedStudent = await student.save();
    res.status(200).json({ success: true, student: updatedStudent });
  } catch (error) {
    console.error('Error in updateStudent:', error);
    return next(new ErrorResponse('Error updating student', 500));
  }
};


  
  // Delete student by studentID
  exports.deleteStudent = async (req, res, next) => {
    try {
      const { id } = req.params; // Use "id" as the parameter name since it corresponds to ":id" in the route path
  
      // Find the student by studentID and delete it
      const result = await Student.deleteOne({ _id: id });
  
      if (result.deletedCount === 0) {
        return next(new ErrorResponse('Student not found', 404));
      }
  
      res.status(200).json({
        success: true,
        data: {},
      });
    } catch (error) {
      return next(error);
    }
  };
  

//get all students
exports.getStudents = async (req, res, next) => {
  try {
      const students = await Student.find();
      res.status(200).json({
          success: true,
          students
      });
  } catch (error) {
      return next(new ErrorResponse(error.message, 500));
  }
};

// Fetch student by MongoDB _id
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return next(new ErrorResponse('Student not found', 404));
    }
    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    return next(error);
  }
};


exports.uploadStudentsFromExcel = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ErrorResponse('No file uploaded. Please upload an Excel file.', 400);
    }

    if (!req.file.originalname.match(/\.(xlsx|xls)$/)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Invalid file format. Only .xlsx and .xls files are allowed.' });
    }


    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const studentsData = xlsx.utils.sheet_to_json(worksheet);

    let validStudents = [];
    let invalidEntries = [];
    let uniqueKeys = new Set();

    studentsData.forEach(student => {
      if (validateStudentData(student)) {
        let uniqueKey = `${student.studentID}-${student.email}`; // Adjust based on your unique fields
        if (!uniqueKeys.has(uniqueKey)) {
          uniqueKeys.add(uniqueKey);
          validStudents.push(student);
        } else {
          invalidEntries.push({ student, error: 'Duplicate record' });
        }
      } else {
        invalidEntries.push({ student, error: 'Invalid data format or missing required fields' });
      }
    });

    if (validStudents.length > 0) {
      await Student.insertMany(validStudents, { ordered: false });
    }

    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      createdCount: validStudents.length,
      invalidEntries: invalidEntries
    });
  } catch (error) {
    console.error('Error processing file:', error);
    fs.unlinkSync(req.file.path);

    if (error.code === 11000) {
      const duplicateFields = error.keyValue ? Object.keys(error.keyValue).join(', ') : 'unknown fields';
      return res.status(400).json({ 
        success: false, 
        message: 'Duplicate key error', 
        error: `Duplicate entry found for ${duplicateFields}. Please ensure all entries are unique.`, 
        details: error.keyValue || {}
      });
    }


    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.keys(error.errors).map(key => {
        return { field: key, message: error.errors[key].message };
      });
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error for one or more fields.', 
        errors: errors 
      });
    }

    return next(new ErrorResponse(`Error processing file: ${error.message}`, 500));
  }
};

function validateStudentData(student) {
  // Adjust validation as per your updated schema
  return student.studentID && student.studentName && 
         emailValidator.validate(student.email) &&
         !isNaN(student.studentID); // Example validation
}
