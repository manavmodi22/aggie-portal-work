import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Fab, Zoom, Tooltip } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import StudentDetailsModal from './StudentDetailsModal';
import BulkUploadStudentModal from './BulkStudentUploadModal';
import CreateStudentModal from './CreateStudentModal';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CreateIcon from '@mui/icons-material/Create';
import UploadIcon from '@mui/icons-material/Upload';
import '../css/StudentManagement.css';

const StudentManagement = () => {
  const [fabOpen, setFabOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/students/all');
        setStudents(response.data.students); // Adjust according to your API response
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const refreshStudents = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/students/all');
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error refreshing students:', error);
    }
  };

  const handleRowClick = (student) => {
    setCurrentStudent(null); // Reset current student
    setTimeout(() => {
      setCurrentStudent(student); // Set new student
      setDetailsModalOpen(true); // Open the modal
    }, 0); // Short timeout to ensure state updates correctly
  };

  const handleToggleFab = () => {
    setFabOpen(!fabOpen);
  };

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
    setFabOpen(false);
  };

  const handleOpenBulkUploadModal = () => {
    setBulkUploadModalOpen(true);
    setFabOpen(false);
  };

  const fabStyle = {
    position: 'fixed',
    bottom: 16, // theme.spacing(2)
    right: 16, // theme.spacing(2)
  };

  // Additional styles for the secondary FABs
  const secondaryFabStyle = (bottomSpacing) => ({
    ...fabStyle,
    bottom: `calc(${fabStyle.bottom}px + ${bottomSpacing}px)`, // Adjust bottom spacing based on the parameter
  });


  return (
    <div className="content">
      <Sidebar />
      <Navbar />
      <h1>Student Management</h1>
  
      {/* <Fab 
        color="primary" 
        aria-label="add" 
        style={{
          margin: 0,
          top: 'auto',
          right: 20,
          bottom: 20,
          left: 'auto',
          position: 'fixed',
          backgroundColor: '#782424' // Aggie Maroon color
        }} 
        onClick={() => setCreateModalOpen(true)}
      >
        <AddIcon />
      </Fab> */}

<Zoom in={!fabOpen}>
        <Fab color="primary" sx={fabStyle} onClick={handleToggleFab}>
          <AddIcon />
        </Fab>
      </Zoom>

      <Zoom in={fabOpen} unmountOnExit>
        <Fab color="secondary" sx={fabStyle} onClick={handleToggleFab}>
          <CloseIcon />
        </Fab>
      </Zoom>

      <Zoom in={fabOpen} unmountOnExit style={{ transitionDelay: `${fabOpen ? 50 : 0}ms` }}>
        <Tooltip title="Create Single Student Record" placement="left">
          <Fab color="primary" sx={secondaryFabStyle(60)} onClick={handleOpenCreateModal}>
            <CreateIcon />
          </Fab>
        </Tooltip>
      </Zoom>

      <Zoom in={fabOpen} unmountOnExit style={{ transitionDelay: `${fabOpen ? 100 : 0}ms` }}>
        <Tooltip title="Bulk Upload Student Records - Excel" placement="left">
          <Fab color="primary" sx={secondaryFabStyle(120)} onClick={handleOpenBulkUploadModal}>
            <UploadIcon />
          </Fab>
        </Tooltip>
      </Zoom>
  
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Name</th>
              <th>Email</th>
              <th>Major</th>
              <th>Skills</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} onClick={() => handleRowClick(student)}>
                {/* <td>{student._id}</td> */}
                <td>{student.studentName}</td>
                <td>{student.email}</td>
                {/* <td className="table-wrap">{student.phone}</td> */}
                <td className="table-wrap">{student.major}</td>
                {/* <td className="table-wrap">{student.degree}</td> */}
                <td className="skills-list">
                  <li>
                    {student.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </li>
                </td>
                <td className="table-wrap">{student.status}</td>
                </tr>
            ))}
          </tbody>
        </table>
        </div>
      {currentStudent && (
        <StudentDetailsModal
          open={isDetailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            setCurrentStudent(null); // Reset current student when modal closes
          }}
          student={currentStudent}
          refreshStudents={refreshStudents} // Pass this as a prop to the modal
        />
      )}
      <CreateStudentModal
        open={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        refreshStudents={refreshStudents}
      />
      <BulkUploadStudentModal
        open={isBulkUploadModalOpen}
        onClose={() => setBulkUploadModalOpen(false)}
        refreshStudents={refreshStudents}
      />
    </div>
  );
};


export default StudentManagement;