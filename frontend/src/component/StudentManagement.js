import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import StudentDetailsModal from './StudentDetailsModal';
import CreateStudentModal from './CreateStudentModal';
import Fab from '@mui/material/Fab'; // Import FAB
import AddIcon from '@mui/icons-material/Add'; // Import Add Icon
import '../css/StudentManagement.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

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


  return (
    <div className="content">
      <Sidebar />
      <Navbar />
      <h1>Student Management</h1>
  
      <Fab 
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
      </Fab>
  
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
    </div>
  );
};

export default StudentManagement;