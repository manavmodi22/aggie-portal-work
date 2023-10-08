const express = require('express');
const router = express.Router();
const {
    createCompany,
    getCompanies,
    getCompany,
    updateCompany,
} = require('../controllers/companyController');
const { isAuthenticated } = require('../middleware/auth');

// Company routes

// Create a new company
router.post('/company/create', isAuthenticated, createCompany);

// Get all companies
router.get('/companies', isAuthenticated, getCompanies);

// Get a single company by ID
router.get('/company/:id', isAuthenticated, getCompany);

// Update a company
router.put('/company/:id', isAuthenticated, updateCompany);

module.exports = router;
