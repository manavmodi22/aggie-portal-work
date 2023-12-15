const Company = require("../models/companyModel");
const ErrorResponse = require("../utils/errorResponse");

//create company

exports.createCompany = async (req, res, next) => {
  try {
    const company = await Company.create({
      companyID: req.body.companyID,
      companyName: req.body.companyName,
      description: req.body.description,
      location: req.body.location,
      user: req.user.id,
    });
    res.status(201).json({
      success: true,
      company,
    });
  } catch (error) {
    return next(error);
  }
};

//get all companies
exports.getCompanies = async (req, res, next) => {
  try {
    const company = await Company.find();
    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    return next(error);
  }
};

//get single company
exports.getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return next(new ErrorResponse("Company not found", 404));
    }
    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    return next(error);
  }
};

//update company
exports.updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      return next(new ErrorResponse("Company not found", 404));
    }

    // Make sure user is Company owner
    if (company.user.toString() !== req.user.id) {
      return next(new ErrorResponse("Not authorized to update Company", 401));
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    return next(error);
  }
};
