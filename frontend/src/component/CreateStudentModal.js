import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import '../css/Modal.css';

const CreateStudentModal = ({ open, onClose, refreshStudents }) => {
  const [newStudent, setNewStudent] = useState({
    studentName: '',
    email: '',
    phone: '',
    major: '',
    degree: '',
    skills: '',
    status: '',
    // Add other fields as necessary
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (event, fieldName) => {
    setNewStudent({ ...newStudent, [fieldName]: event.target.value });
  };

  const handleCreateStudent = async () => {
    try {
      // Add validation or error handling as necessary
      await axios.post('http://localhost:9000/api/students/create', newStudent);
      refreshStudents();
      onClose();
    } catch (error) {
      console.error('Error creating student:', error);
      // Handle error (show error message, set error state, etc.)
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
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </Typography>
      </DialogTitle>
      <DialogContent>
        {/* Add form fields here */}
        <FormControl fullWidth margin="normal">
          <TextField
            label="Student Name"
            type="text"
            value={newStudent.studentName}
            onChange={(e) => handleInputChange(e, 'studentName')}
            error={!!errors.studentName}
            helperText={errors.studentName}
          />
        </FormControl>
        {/* Repeat for other fields like email, phone, etc. */}
      </DialogContent>
      <DialogActions className="button-container">
        <Button onClick={handleCreateStudent} startIcon={<AddCircleOutlineIcon />} className="button">
          Create Student
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateStudentModal;
