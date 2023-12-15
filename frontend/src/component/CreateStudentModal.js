import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  IconButton,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import "../css/Modal.css";

const CreateStudentModal = ({ open, onClose, refreshStudents }) => {
  const [newStudent, setNewStudent] = useState({
    studentID: "",
    studentName: "",
    email: "",
    phone: "",
    major: "",
    degree: "",
    skills: [],
    summary: "",
    portfolio: "",
    linkedin: "",
    github: "",
    cohort: "",
    status: "",
    companiesAssociatedWith: [],
  });
  const [errors, setErrors] = useState({});

  // Status and cohort options
  const statusOptions = [
    "Actively searching for Internships",
    "Passively searching for Internships",
    "Not searching for Internships",
    "Actively Searching for Full-Time Positions",
    "Not searching for Full-Time Positions",
    "Passively searching for Full-Time Positions",
    "Looking to go to Graduate School",
    "Employed Full Time",
  ];

  const cohortOptions = [0, 1, 2, 3, 4];

  const handleInputChange = (event, fieldName) => {
    setNewStudent({ ...newStudent, [fieldName]: event.target.value });
  };

  const handleCreateStudent = async () => {
    try {
      // Add validation or error handling as necessary
      const response = await axios.post(
        "http://localhost:9000/api/student/create",
        newStudent
      );
      if (response.data.success) {
        refreshStudents();
        onClose();
      } else {
        // Handle server-side validation errors here
      }
    } catch (error) {
      console.error("Error creating student:", error.response.data);
      // Handle error (show error message, set error state, etc.)
      setErrors(error.response.data.errors || {});
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Create New Student
          <IconButton
            aria-label="close"
            onClick={onClose}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </Typography>
      </DialogTitle>
      <DialogContent>
        {/* Form fields */}
        <FormControl fullWidth margin="normal">
          <TextField
            label="Student ID"
            type="number"
            value={newStudent.studentID}
            onChange={(e) => handleInputChange(e, "studentID")}
            error={!!errors.studentID}
            helperText={errors.studentID}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Student Name"
            type="text"
            value={newStudent.studentName}
            onChange={(e) => handleInputChange(e, "studentName")}
            error={!!errors.studentName}
            helperText={errors.studentName}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Email"
            type="email"
            value={newStudent.email}
            onChange={(e) => handleInputChange(e, "email")}
            error={!!errors.email}
            helperText={errors.email}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Phone"
            type="text"
            value={newStudent.phone}
            onChange={(e) => handleInputChange(e, "phone")}
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Major"
            type="text"
            value={newStudent.major}
            onChange={(e) => handleInputChange(e, "major")}
            error={!!errors.major}
            helperText={errors.major}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Degree"
            type="text"
            value={newStudent.degree}
            onChange={(e) => handleInputChange(e, "degree")}
            error={!!errors.degree}
            helperText={errors.degree}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Skills (comma-separated)"
            type="text"
            value={newStudent.skills.join(", ")}
            onChange={(e) => handleInputChange(e, "skills")}
            error={!!errors.skills}
            helperText={errors.skills}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            value={newStudent.status}
            label="Status"
            onChange={(e) => handleInputChange(e, "status")}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="cohort-label">Cohort</InputLabel>
          <Select
            labelId="cohort-label"
            value={newStudent.cohort}
            label="Cohort"
            onChange={(e) => handleInputChange(e, "cohort")}
          >
            {cohortOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Additional fields like summary, portfolio, linkedin, github can be added similarly */}
      </DialogContent>
      <DialogActions className="button-container">
        <Button
          onClick={handleCreateStudent}
          startIcon={<AddCircleOutlineIcon />}
          className="button"
        >
          Create Student
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateStudentModal;
