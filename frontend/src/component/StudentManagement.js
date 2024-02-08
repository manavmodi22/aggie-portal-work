import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Fab,
  Zoom,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  Button,
  TextField,
  OutlinedInput,
  InputLabel,
  Checkbox,
  ListItemText,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import StudentDetailsModal from "./StudentDetailsModal";
import BulkUploadStudentModal from "./BulkStudentUploadModal";
import CreateStudentModal from "./CreateStudentModal";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CreateIcon from "@mui/icons-material/Create";
import UploadIcon from "@mui/icons-material/Upload";
import "../css/StudentManagement.css";
import Pagination from "@mui/material/Pagination";

const StudentManagement = () => {
  const [fabOpen, setFabOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("studentName");
  const [filters, setFilters] = useState({
    major: [],
    cohort: [],
    status: [],
    companiesAssociatedWith: [],
  });
  const [filterOptions, setFilterOptions] = useState({
    major: [],
    cohort: [],
    status: [],
    companiesAssociatedWith: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Function to build query string for API call
  const buildQueryString = () => {
    let query = `page=${currentPage}&limit=6`;
    if (searchQuery && selectedField) {
      query += `&searchField=${selectedField}&searchTerm=${searchQuery}`;
    }
    // Check if any filter has a non-empty array
    if (Object.keys(filters).some((key) => filters[key].length > 0)) {
      const activeFilters = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key].length > 0) {
          activeFilters[key] = filters[key];
        }
      });
      query += `&filters=${encodeURIComponent(JSON.stringify(activeFilters))}`;
    }
    return query;
  };

  // Function to fetch students with filters, search, and pagination
  const fetchStudents = async () => {
    try {
      const queryString = buildQueryString();
      const response = await axios.get(
        `http://localhost:9000/api/students/all?${queryString}`
      );
      setStudents(response.data.students);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents(); // Fetch students when component mounts or currentPage changes
  }, [currentPage, searchQuery, selectedField, filters]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const refreshStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/students/all"
      );
      setStudents(response.data.students);
    } catch (error) {
      console.error("Error refreshing students:", error);
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

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFieldChange = (event) => {
    setSelectedField(event.target.value);
  };

  const handleSearch = () => {
    fetchStudents(); // Call fetchStudents when a search is performed
  };
  // ----------------FAB-----------------

  const fabStyle = {
    position: "fixed",
    bottom: 16, // theme.spacing(2)
    right: 16, // theme.spacing(2)
  };

  // Additional styles for the secondary FABs
  const secondaryFabStyle = (bottomSpacing) => ({
    ...fabStyle,
    bottom: `calc(${fabStyle.bottom}px + ${bottomSpacing}px)`, // Adjust bottom spacing based on the parameter
  });

  // ----------------FILTERS-----------------

  const fetchDistinctMajors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/students/majors/distinctmajor"
      );
      const fetchedMajors = response.data.majors;
      if (!Array.isArray(fetchedMajors)) {
        console.error("Fetched majors is not an array:", fetchedMajors);
        return;
      }
      setFilterOptions((prevOptions) => ({
        ...prevOptions,
        major: fetchedMajors,
      }));
    } catch (error) {
      console.error("Error fetching distinct majors:", error);
    }
  };

  const fetchDistinctSkills = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/students/majors/distinctskills"
      );
      const fetchedSkills = response.data.skills;
      if (!Array.isArray(fetchedSkills)) {
        console.error("Fetched skills is not an array:", fetchedSkills);
        return;
      }
      setFilterOptions((prevOptions) => ({
        ...prevOptions,
        skills: fetchedSkills,
      }));
    } catch (error) {
      console.error("Error fetching distinct skills:", error);
    }
  };

  const fetchDistinctCohorts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/students/majors/distinctcohorts"
      );
      setFilterOptions((prev) => ({ ...prev, cohort: response.data.cohorts }));
    } catch (error) {
      console.error("Error fetching distinct cohorts:", error);
    }
  };

  const fetchDistinctStatuses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/students/majors/distinctstatuses"
      );
      setFilterOptions((prev) => ({
        ...prev,
        status: response.data.statuses,
      }));
    } catch (error) {
      console.error("Error fetching distinct statuses:", error);
    }
  };

  const fetchDistinctCompanies = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/students/majors/distinctcompanies"
      );
      setFilterOptions((prev) => ({
        ...prev,
        companiesAssociatedWith: response.data.companies,
      }));
    } catch (error) {
      console.error("Error fetching distinct companies:", error);
    }
  };

  useEffect(() => {
    fetchDistinctMajors();
    fetchDistinctSkills();
    fetchDistinctCohorts();
    fetchDistinctStatuses();
    fetchDistinctCompanies();
  }, []);

  const handleFilterChange = (filterKey) => (event) => {
    setFilters({ ...filters, [filterKey]: event.target.value });
  };

  const handleResetFilters = (filterKey) => {
    setFilters({ ...filters, [filterKey]: [] });
  };

  const handleDropdownOpen = (filterKey) => {
    setDropdownOpen({ ...dropdownOpen, [filterKey]: true });
  };

  const handleDropdownClose = (filterKey) => {
    setDropdownOpen({ ...dropdownOpen, [filterKey]: false });
  };

  const safeFilterOptions = (filterKey) => filterOptions[filterKey] || [];
  const safeFilters = (filterKey) => filters[filterKey] || [];

  return (
    <div className="content">
      <Sidebar />
      <Navbar />
      {/* <h1
        style={{
          textAlign: "center",
          marginTop: "100px",
          marginBottom: "50px",
          marginLeft: "250px",
          marginRight: "250px",
        }} 
      >
        Student Management
      </h1> */}
      <div
        style={{
          position: "sticky",
          top: "80px",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          backgroundColor: "offwhite",
          border: "0.5px solid black",
          marginLeft: "241px",
          marginBottom: "100px",
          opacity: 1, // Make the search bar opaque
        }}
      >
        <Tooltip
          title="Select the field you want to search in and enter your query"
          leaveDelay={1}
        >
          <FormControl
            style={{
              marginLeft: "0px",
              minWidth: 100,
              backgroundColor: "black",
              color: "white",
              fontWeight: "bold",
              fontSize: "10px",
            }}
          >
            <Select
              value={selectedField}
              onChange={handleFieldChange}
              style={{ color: "white", fontWeight: "500px" }}
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: "black",
                    color: "white",
                  },
                },
              }}
              IconComponent={() => (
                <ArrowDropDownIcon style={{ color: "white" }} />
              )}
            >
              <MenuItem
                value={"studentName"}
                style={{ color: "white", fontWeight: "400px" }}
              >
                Student Name
              </MenuItem>
              <MenuItem
                value={"companies"}
                style={{ color: "white", fontWeight: "400px" }}
              >
                Companies
              </MenuItem>
              <MenuItem
                value={"skills"}
                style={{ color: "white", fontWeight: "400px" }}
              >
                Skills
              </MenuItem>
            </Select>
          </FormControl>
        </Tooltip>

        <TextField
          style={{ flexGrow: 1, marginRight: "0px" }}
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          placeholder="Search..."
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          style={{ backgroundColor: "black" }}
        >
          <SearchIcon />
        </Button>
      </div>

      <div
        style={{
          margin: "10px 10px 10px 250px",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {Object.keys(filterOptions).map((filterKey) => (
          <FormControl
            key={filterKey}
            variant="outlined"
            style={{ minWidth: "150px", margin: "10px", maxWidth: "350px" }}
          >
            <InputLabel htmlFor={`select-${filterKey}`}>
              {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
            </InputLabel>
            <Select
              multiple
              value={safeFilters(filterKey)}
              onChange={handleFilterChange(filterKey)}
              input={
                <OutlinedInput
                  id={`select-${filterKey}`}
                  label={filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
                />
              }
              open={dropdownOpen[filterKey]}
              onOpen={() => handleDropdownOpen(filterKey)}
              onClose={() => handleDropdownClose(filterKey)}
              renderValue={() => null}
              MenuProps={{
                PaperProps: { style: { maxHeight: "200px" } },
                getContentAnchorEl: null,
              }}
            >
              {safeFilterOptions(filterKey).map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox checked={safeFilters(filterKey).includes(option)} />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
              <div
                style={{
                  position: "sticky",
                  bottom: 0,
                  backgroundColor: "white",
                  borderTop: "1px solid #ccc",
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  color="primary"
                  onClick={() => handleResetFilters(filterKey)}
                >
                  Reset
                </Button>
                <Button color="primary" onClick={fetchStudents}>
                  Apply
                </Button>
              </div>
            </Select>
          </FormControl>
        ))}
      </div>
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

      <Zoom
        in={fabOpen}
        unmountOnExit
        style={{ transitionDelay: `${fabOpen ? 50 : 0}ms` }}
      >
        <Tooltip title="Create Single Student Record" placement="left">
          <Fab
            color="primary"
            sx={secondaryFabStyle(60)}
            onClick={handleOpenCreateModal}
          >
            <CreateIcon />
          </Fab>
        </Tooltip>
      </Zoom>

      <Zoom
        in={fabOpen}
        unmountOnExit
        style={{ transitionDelay: `${fabOpen ? 100 : 0}ms` }}
      >
        <Tooltip title="Bulk Upload Student Records - Excel" placement="left">
          <Fab
            color="primary"
            sx={secondaryFabStyle(120)}
            onClick={handleOpenBulkUploadModal}
          >
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
                <td className="table-wrap">
                  {Array.isArray(student.skills)
                    ? student.skills.join(", ")
                    : typeof student.skills === "string"
                    ? student.skills
                    : "N/A"}{" "}
                  {/* Add a default value if skills are not available */}
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
      <div className="pagination-container">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
      </div>

      <BulkUploadStudentModal
        open={isBulkUploadModalOpen}
        onClose={() => setBulkUploadModalOpen(false)}
        refreshStudents={refreshStudents}
      />
    </div>
  );
};

export default StudentManagement;
