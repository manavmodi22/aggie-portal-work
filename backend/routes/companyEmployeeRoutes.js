const express = require('express');
const router = express.Router();
const {
    createEmployee,
    getEmployeesByCompanyName,
    updateEmployee,
    deleteEmployee,
} = require('../controllers/companyEmployeeController');
const { isAuthenticated } = require('../middleware/auth');

// Employee routes

// Create a new employee
router.post('/employee/create', isAuthenticated, createEmployee);

// Get employees of a specific company by company name (fuzzy search and case-insensitive)
router.get('/employees/company/:companyName', getEmployeesByCompanyName);

// Update an employee
router.put('/employees/update/:id', isAuthenticated, updateEmployee);

// Delete an employee
router.delete('/employees/delete/:id', isAuthenticated, deleteEmployee);

module.exports = router;
