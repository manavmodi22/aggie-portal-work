import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Box, Typography, Table, TableBody, TableRow, TableCell, TextField, Button, IconButton, Snackbar, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import '../css/StudentDetailModal.css';


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const fieldNamesMapping = {
  studentID: 'Student ID',
  studentName: 'Student Full Name',
  email: 'E-mail',
  phone: 'Phone',
  major: 'Major',
  degree: 'Degree',
  skills: 'Skills',
  summary: 'Summary',
  portfolio: 'Portfolio',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  cohort: 'Cohort',
  status: 'Status',
  companiesAssociatedWith: 'Companies Associated With',
  // You can add more fields here as needed
};

const fieldsToDisplay = [
  'studentName',
  'email',
  'phone',
  'major',
  'degree',
  'skills',
  'summary',
  'portfolio',
  'linkedin',
  'github',
  'cohort',
  'status',
  'companiesAssociatedWith',
];

const StudentDetailsModal = ({ open, onClose, student, refreshStudents }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [studentDetails, setStudentDetails] = useState({ ...student, skills: student.skills || [] });
  const [newSkill, setNewSkill] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newSkillError, setNewSkillError] = useState(false);
  const [newCompanyError, setNewCompanyError] = useState(false);
  const [resumeFile, setResumeFile] = useState(null); 
  const [resumeFileName, setResumeFileName] = useState('');


  // Define statusOptions array
  const statusOptions = [
    'Actively searching for Internships', 
    'Passively searching for Internships', 
    'Not searching for Internships', 
    'Actively Searching for Full-Time Positions', 
    'Not searching for Full-Time Positions', 
    'Passively searching for Full-Time Positions', 
    'Looking to go to Graduate School',
    'Employed Full Time',
  ];

  const fetchStudentDetails = useCallback(async () => {
    if (open && student._id) {
      try {
        setIsFetching(true);
        const response = await axios.get(`http://localhost:9000/api/students/${student._id}`);
        setStudentDetails(response.data.student);
        setIsFetching(false);
      } catch (error) {
        console.error('Error fetching student details:', error);
        setIsFetching(false);
      }
    }
  }, [open, student._id]);

  useEffect(() => {
    fetchStudentDetails();
  }, [fetchStudentDetails]);

  const handleInputChange = (event, fieldName) => {
    setStudentDetails({ ...studentDetails, [fieldName]: event.target.value });
  };

  const handleAddSkill = () => {
    if (newSkill) {
      setStudentDetails((prevDetails) => ({
        ...prevDetails,
        skills: [...prevDetails.skills, newSkill],
      }));
      setNewSkill('');
      setNewSkillError(false); // Reset error state
    } else {
      // Display an error message
      setNewSkillError(true);
    }
  };
  

  const handleConfirm = async () => {
    try {
      const formData = new FormData();
      Object.entries(studentDetails).forEach(([key, value]) => {
        if (key !== 'resume') {
          formData.append(key, value);
        }
      });
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      await axios.put(`http://localhost:9000/api/student/update/${studentDetails._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      refreshStudents();
      setSuccessMessage(`Student "${studentDetails.studentName}" updated successfully`);
      setShowSnackbar(true);
      setIsEditing(false);
      setTimeout(() => setShowSnackbar(false), 3000);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };


  const handleCancel = () => {
    setStudentDetails({ ...student }); // Reset to original values
    onClose();
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${studentDetails.studentName}?`)) {
      try {
        await axios.delete(`http://localhost:9000/api/student/delete/${studentDetails._id}`);
        refreshStudents();
        setSuccessMessage(`Student "${studentDetails.studentName}" deleted successfully`);
        setShowSnackbar(true);
        setTimeout(() => {
          setShowSnackbar(false); // Hide success message after delay
          onClose(); // Close the modal after a delay
        }, 2500);
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleResumeSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setResumeFile(file);
      setResumeFileName(file.name); 
    }
  };


  const handleAddCompany = (key) => {
    if (newCompany) {
      setStudentDetails((prevDetails) => ({
        ...prevDetails,
        [key]: [...prevDetails[key], newCompany],
      }));
      setNewCompany('');
      setNewCompanyError(false); // Reset error state
    } else {
      // Display an error message
      setNewCompanyError(true);
    }
  };

  
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle}>
          <IconButton onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="h2">Student Details</Typography>
          {isFetching ? (
            <p className="loading-text">Loading...</p>
          ) : (
            <div className="scrollable-table-container">
              <Table>
                <TableBody>
                  {fieldsToDisplay.map((key) => {
                    if (key === 'user' || key === '__v' || key === 'resume') {
                      return null; // Skip certain fields
                    }
  
                    const isSelectField = key === 'status' || key === 'cohort';
                    const isEditableField = key === 'summary' || key === 'portfolio' || key === 'linkedin' || key === 'github';
  
                    if (Array.isArray(studentDetails[key])) {
                      return (
                        <TableRow key={key}>
                        <TableCell component="th" className="wrap-text-cell">
                          {fieldNamesMapping[key]}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <>
                              {studentDetails[key].join(', ')}
                              <div>
                                {key === 'skills' && (
                                  <div>
                                    <TextField
                                      label="New Skill"
                                      value={newSkill}
                                      onChange={(e) => setNewSkill(e.target.value)}
                                      error={newSkillError}
                                      helperText={newSkillError ? "Skill can't be empty" : ''}
                                    />
                                    <Button onClick={handleAddSkill}>Add Skill</Button>
                                  </div>
                                )}
                                {key === 'companiesAssociatedWith' && (
                                  <div>
                                    <TextField
                                      label="New Company"
                                      value={newCompany}
                                      onChange={(e) => setNewCompany(e.target.value)}
                                      error={newCompanyError}
                                      helperText={newCompanyError ? "Company name can't be empty" : ''}
                                    />
                                    <Button onClick={() => handleAddCompany(key)}>Add Company</Button>
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            studentDetails[key].join(', ') || <span style={{ color: 'red' }}>No value fetched</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  } else
                  {return (
                    <TableRow key={key}>
                      <TableCell component="th" className="wrap-text-cell">
                        {fieldNamesMapping[key]}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          isSelectField ? (
                            <Select
                              value={studentDetails[key] || ''}
                              onChange={(e) => handleInputChange(e, key)}
                              fullWidth
                            >
                              {statusOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          ) : isEditableField ? (
                            <TextField
                              fullWidth
                              multiline={key === 'summary'}
                              rows={4}
                              value={studentDetails[key] || ''}
                              onChange={(e) => handleInputChange(e, key)}
                            />
                          ) : (
                            <TextField
                              fullWidth
                              value={studentDetails[key] || ''}
                              onChange={(e) => handleInputChange(e, key)}
                            />
                          )
                        ) : (
                          studentDetails[key] || <span style={{ color: 'red' }}>No value fetched</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
              {/* Resume section */}
              <TableRow>
                  <TableCell component="th">
                    Resume
                  </TableCell>
                  <TableCell>
                    {studentDetails.resume && !isEditing && (
                      <Button onClick={() => window.open(`http://localhost:9000/api/students/resume/${studentDetails._id}`, '_blank')}>View Resume</Button>
                    )}
                    {isEditing && (
                      <>
                        <Button
                          variant="contained"
                          component="label"
                        >
                          Select File
                          <input
                            type="file"
                            hidden
                            accept=".pdf,.doc,.docx"
                            onChange={handleResumeSelect}
                          />
                        </Button>
                        {resumeFileName && <span style={{ marginLeft: '10px' }}>{resumeFileName}</span>}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
      )}
      <div className="button-group">
        {isEditing ? (
          <>
            <Button onClick={handleCancel}>Cancel Changes</Button>
            <Button onClick={handleConfirm}>Confirm Changes</Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
            <Button onClick={handleDelete} color="secondary">Delete</Button>
          </>
        )}
      </div>
    </Box>
  </Modal>
  <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={() => setShowSnackbar(false)} message={successMessage} />
</>
);
};

export default StudentDetailsModal;
