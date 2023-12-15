const CompanyEmployee = require("../models/companyEmployeeModel.js");
const Company = require("../models/companyModel.js");
const ErrorResponse = require("../utils/errorResponse");

//create employee

exports.createEmployee = async (req, res, next) => {
  try {
    const employee = await CompanyEmployee.create({
      employeeID: req.body.employeeID,
      employeeName: req.body.employeeName,
      email: req.body.email,
      phone: req.body.phone,
      companyID: req.body.companyID,
      user: req.user.id,
    });
    res.status(201).json({
      success: true,
      employee,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getEmployeesByCompanyName = async (req, res, next) => {
  try {
    const companyName = req.params.companyName;
    const { page = 1, limit = 10 } = req.query;

    const regexPattern = new RegExp(companyName, "i");
    const companies = await Company.find({ companyName: regexPattern });

    if (!companies || companies.length === 0) {
      return next(new ErrorResponse("No matching companies found", 404));
    }

    const companyIds = companies.map((company) => company.companyID);

    const skip = (page - 1) * limit;

    const employees = await CompanyEmployee.find({
      companyID: { $in: companyIds },
    })
      .select("employeeName email phone")
      .skip(skip)
      .limit(parseInt(limit));

    const totalEmployees = await CompanyEmployee.find({
      companyID: { $in: companyIds },
    }).countDocuments();

    const formattedEmployees = employees.map((employee) => ({
      employeeName: employee.employeeName,
      email: employee.email,
      phone: employee.phone ? employee.phone : "not available",
    }));

    res.status(200).json({
      success: true,
      employees: formattedEmployees,
      currentPage: page,
      totalPages: Math.ceil(totalEmployees / limit),
      totalEmployees,
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
      return next(new ErrorResponse("Employee not found", 404));
    }

    // Check if "employeeID" is present in req.body
    if (req.body.employeeID) {
      return next(new ErrorResponse("Cannot update employeeID field", 400));
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
exports.deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params; // Use "id" as the parameter name since it corresponds to ":id" in the route path

    // Find the employee by ID and delete it
    const result = await CompanyEmployee.deleteOne({ employeeID: id });

    if (result.deletedCount === 0) {
      return next(new ErrorResponse("Employee not found", 404));
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    return next(error);
  }
};
