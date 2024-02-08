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
  Chip,
  InputLabel,
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

const StudentManagement = () => {
  const [fabOpen, setFabOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("firstName");
  const [filters, setFilters] = useState({
    major: [],
    skills: [],
    status: [],
    // Add other filters here
  });
  const [filterOptions, setFilterOptions] = useState({
    majors: [],
    skills: [],
    statuses: [],
    // Add other filter options here
  });

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await axios.get(
        "http://localhost:9000/api/students/all"
      );
      setStudents(response.data.students);
    };

    fetchStudents();
  }, []);

  const refreshStudents = async () => {
    const response = await axios.get("http://localhost:9000/api/students/all");
    setStudents(response.data.students);
  };

  const fetchFilterOptions = async () => {
    try {
      const majorsResponse = await axios.get("/api/students/distinct/major");
      const skillsResponse = await axios.get("/api/students/distinct/skills");
      const statusesResponse = await axios.get("/api/students/distinct/status");
      // Fetch other filters similarly

      setFilterOptions({
        majors: majorsResponse.data.data,
        skills: skillsResponse.data.data,
        statuses: statusesResponse.data.data,
        // Set other filter options here
      });

      localStorage.setItem(
        "filterOptions",
        JSON.stringify({
          majors: majorsResponse.data.data,
          skills: skillsResponse.data.data,
          statuses: statusesResponse.data.data,
          // Cache other filter options here
        })
      );
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  useEffect(() => {
    const cachedOptions = localStorage.getItem("filterOptions");
    if (cachedOptions) {
      setFilterOptions(JSON.parse(cachedOptions));
    } else {
      fetchFilterOptions();
    }
  }, []);

  const handleFilterChange = (field) => (event) => {
    setFilters({ ...filters, [field]: event.target.value });
  };

  const handleSearch = () => {
    console.log(
      `Searching for ${searchQuery} in ${selectedField} with filters`,
      filters
    );
    // Combine search query and filters to fetch data
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFieldChange = (event) => {
    setSelectedField(event.target.value);
  };

  return (
    <div className="content">
      {/* <Sidebar />
      <Navbar /> */}

      <div
        style={
          {
            /* styling for search bar */
          }
        }
      >
        <Tooltip title="Select the field you want to search in and enter your query">
          <FormControl>
            <InputLabel>Search Field</InputLabel>
            <Select value={selectedField} onChange={handleFieldChange}>
              <MenuItem value="firstName">First Name</MenuItem>
              <MenuItem value="lastName">Last Name</MenuItem>
              <MenuItem value="companies">Companies</MenuItem>
              <MenuItem value="skills">Skills</MenuItem>
              {/* Add other search fields here */}
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
        style={
          {
            /* styling for filter buttons */
          }
        }
      >
        {Object.keys(filterOptions).map((filterKey) => (
          <FormControl key={filterKey}>
            <InputLabel>{filterKey}</InputLabel>
            <Select
              multiple
              value={filters[filterKey]}
              onChange={handleFilterChange(filterKey)}
              renderValue={(selected) => (
                <div>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </div>
              )}
            >
              {filterOptions[filterKey].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
        <Button onClick={fetchFilterOptions}>Refresh Filters</Button>
      </div>

      {/* Add other components such as table, modals, etc. */}
    </div>
  );
};

export default StudentManagement;
