// Sidebar.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/Sidebar.css'; // assuming you have a Sidebar.css

const Sidebar = () => {
  const location = useLocation();

  const isItemSelected = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
        <div className="sidebar-header">Admin Panel</div>
        <ul>
            <li className={isItemSelected("/admin/user-management") ? "selected" : ""}>
            <Link to="/admin/user-management">User Management</Link>
            </li>
            <li className={isItemSelected("/admin/student-management") ? "selected" : ""}>
            <Link to="/admin/student-management">Student Management</Link>
            </li>
        </ul>
        </div>
  );
};

export default Sidebar;
