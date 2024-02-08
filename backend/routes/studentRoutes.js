const express = require("express");
const router = express.Router();
const {
  createStudent,
  searchStudentsBySkills,
  updateStudent,
  deleteStudent,
  getStudents,
  getStudentResume,
  getStudentById,
  uploadStudentsFromExcel,
  //getStudentsByFields,
  getDistinctMajors,
  getDistinctSkills,
  getDistinctCohorts,
  getDistinctStatuses,
  getDistinctCompanies,
} = require("../controllers/studentController");
const { isAuthenticated } = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Student routes

// Create a new student
router.post("/student/create", createStudent);

// Get all students
router.get("/students/all", getStudents);

//Fetch student by id
router.get("/students/:id", getStudentById);

// Search for students by skills with pagination
router.get("/students", searchStudentsBySkills);

// Fetch Student Resume
router.get("/students/:studentID/resume", getStudentResume);

// Update a student
router.put("/student/update/:id", upload.single("resume"), updateStudent);

// Delete a student
router.delete("/student/delete/:id", deleteStudent);

//view resume
router.get("/students/resume/:id", getStudentResume);

// // Get distinct filter options
// router.get('/students/filters', getStudentsByFields);

router.get('/students/majors/distinctmajor', getDistinctMajors);

router.get('/students/majors/distinctskills', getDistinctSkills);

router.get('/students/majors/distinctcohorts', getDistinctCohorts);

router.get('/students/majors/distinctstatuses', getDistinctStatuses);

router.get('/students/majors/distinctcompanies', getDistinctCompanies);



// Upload students from Excel
router.post(
  "/students/create/excel",
  upload.single("file"),
  uploadStudentsFromExcel
);

module.exports = router;
