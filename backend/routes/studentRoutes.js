const express = require('express');
const router = express.Router();
const {
    createStudent,
    searchStudentsBySkills,
    updateStudent,
    deleteStudent,
    getStudents,
} = require('../controllers/studentController');
const { isAuthenticated } = require('../middleware/auth');

// Student routes

// Create a new student
router.post('/student/create', isAuthenticated, createStudent);

// Search for students by skills with pagination
router.get('/students', isAuthenticated, searchStudentsBySkills);

// Update a student
router.put('/student/update/:id', isAuthenticated, updateStudent);

// Delete a student
router.delete('/student/delete/:id', isAuthenticated, deleteStudent);

// Get all students
router.get('/students/all', isAuthenticated, getStudents);

module.exports = router;
