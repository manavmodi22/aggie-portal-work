const CompanyEmployee = require('../models/companyEmployeeModel.js');
const Company = require('../models/companyModel.js');
const ErrorResponse = require('../utils/errorResponse');

//create employee

exports.createEmployee = async (req, res, next) => {
    try {
        const employee = await CompanyEmployee.create({
            employeeID: req.body.employeeID,
            employeeName: req.body.employeeName,
            email: req.body.email,
            phone: req.body.phone,
            companyID: req.body.companyID,
            user: req.user.id
        });
        res.status(201).json({
            success: true,
            employee
        })
    } catch (error) {
        return next(error);
    }
}

// Get employees of a specific company by company name (fuzzy search and case-insensitive)
exports.getEmployeesByCompanyName = async (req, res, next) => {
    try {
        // Extract the company name from the request parameters
        const companyName = req.params.companyName;

        // Extract pagination parameters
        const { page = 1, perPage = 10 } = req.query;

        // Create a regular expression pattern for fuzzy search and make it case-insensitive
        const regexPattern = new RegExp(companyName, 'i');

        // Find companies whose names match the pattern
        const companies = await Company.find({ companyName: regexPattern });

        if (!companies || companies.length === 0) {
            return next(new ErrorResponse('No matching companies found', 404));
        }

        // Extract the company IDs of matching companies
        const companyIds = companies.map((company) => company.companyID);

        // Calculate the skip value for pagination
        const skip = (page - 1) * perPage;

        // Find employees of the matching companies with pagination
        const employees = await CompanyEmployee.find({ companyID: { $in: companyIds } })
            .select('employeeName email phone') // Include the necessary fields
            .skip(skip)
            .limit(parseInt(perPage));

        // Map the result to format phone as "not available" if it's not present
        const formattedEmployees = employees.map((employee) => ({
            employeeName: employee.employeeName,
            email: employee.email,
            phone: employee.phone ? employee.phone : 'not available',
        }));

        res.status(200).json({
            success: true,
            employees: formattedEmployees,
        });
    } catch (error) {
        return next(error);
    }
};


//update employee
exports.updateEmployee = async (req, res, next) => {
  try {
      const { id } = req.params; // Use "id" as the parameter name since it corresponds to ":id" in the route path

      // Find the employee by ID
      const employee = await CompanyEmployee.findOne({ employeeID: id });

      if (!employee) {
          return next(new ErrorResponse('Employee not found', 404));
      }

      // Check if "employeeID" is present in req.body
      if (req.body.employeeID) {
          return next(new ErrorResponse('Cannot update employeeID field', 400));
      }

      // Update other fields based on req.body
      employee.set(req.body);

      const updatedEmployee = await employee.save();

      res.status(200).json({
          success: true,
          employee: updatedEmployee,
      });
  } catch (error) {
      return next(error);
  }
};


// Delete employee by ID
// Delete employee by ID
exports.deleteEmployee = async (req, res, next) => {
  try {
      const { id } = req.params; // Use "id" as the parameter name since it corresponds to ":id" in the route path

      // Find the employee by ID and delete it
      const result = await CompanyEmployee.deleteOne({ employeeID: id });

      if (result.deletedCount === 0) {
          return next(new ErrorResponse('Employee not found', 404));
      }

      res.status(200).json({
          success: true,
          data: {},
      });
  } catch (error) {
      return next(error);
  }
};
