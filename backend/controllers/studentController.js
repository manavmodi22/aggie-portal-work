const Student = require('../models/studentModel');
const ErrorResponse = require('../utils/errorResponse');

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


exports.searchStudentsBySkills = async (req, res, next) => {
    try {
        const { skills, page = 1, perPage = 10 } = req.query;
        if (!skills) {
            return res.status(400).json({ error: 'Skills parameter is required' });
        }

        // Split the skills string by commas and trim whitespace
        const skillList = skills.split(',').map(skill => skill.trim());

        // Calculate the skip value for pagination
        const skip = (page - 1) * perPage;

        // Use the $in operator to find students with matching skills
        const students = await Student.find({ skills: { $in: skillList } })
            .sort({ skills: -1 }) // Sort by the number of matching skills in descending order
            .skip(skip)
            .limit(parseInt(perPage))
            .exec();

        res.json(students);
    } catch (error) {
        return next(error);
    }
};


//update student
exports.updateStudent = async (req, res, next) => {
    try {
        let student = await Student.findById(req.params.id);

        if (!student) {
            return next(new ErrorResponse('Student not found', 404))
        }

        // Make sure user is student owner
        if (student.user.toString() !== req.user.id) {
            return next(new ErrorResponse('Not authorized to update student', 401))
        }

        student = await Student.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            student
        })
    } catch (error) {
        return next(error);
    }
}

//delete student
exports.deleteStudent = async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return next(new ErrorResponse('Student not found', 404))
        }

        // Make sure user is student owner
        if (student.user.toString() !== req.user.id) {
            return next(new ErrorResponse('Not authorized to delete student', 401))
        }

        await student.remove();

        res.status(200).json({
            success: true,
            data: {}
        })
    } catch (error) {
        return next(error);
    }
}

//get all students
exports.getStudents = async (req, res, next) => {
    try {
        const students = await Student.find();
        res.status(200).json({
            success: true,
            students
        })
    } catch (error) {
        return next(error);
    }
}
