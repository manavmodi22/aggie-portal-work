import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Button } from "@mui/material"; // Assuming you are using Material-UI for buttons
import StatusModal from "./StatusModal";
import EditUserModal from "./EditUserModal";
import "../css/UserManagement.css";

const roleMapping = {
  0: "Admin",
  1: "Mays Faculty",
  2: "Employer/ Recruiter",
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isStatusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedUserForStatusChange, setSelectedUserForStatusChange] =
    useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fetch users when the component mounts
    const fetchUsers = async () => {
      try {
        const config = {
          method: "GET",
          url: "http://localhost:9000/api/allusers",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        const apiResponse = await axios.request(config);
        setUsers(apiResponse.data.users); // Assuming the response has a users array
      } catch (error) {
        console.error("Error fetching users:", error);
        // Handle error
      }
    };

    fetchUsers(); // Call fetchUsers here to execute it
  }, []);

  const getRoleString = (roleNumber) => {
    return roleMapping[roleNumber] || "Unknown Role";
  };

  // Placeholder functions for modal triggers
  const handleEditClick = (user) => {
    setCurrentUser(user);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setCurrentUser(null);
  };

  const handleDeleteClick = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      try {
        const config = {
          method: "DELETE",
          url: `http://localhost:9000/api/admin/user/delete/${userId}`,
          // ... your config
        };
        await axios.request(config);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
        alert("User deleted successfully"); // Replace with snackbar for better UX
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user"); // Replace with snackbar for better UX
      }
    }
  };

  const handleStatusClick = (user) => {
    setSelectedUserForStatusChange(user);
    setStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setStatusModalOpen(false);
    setSelectedUserForStatusChange(null);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      // API call to update the user in the backend
      const config = {
        method: "PUT",
        url: `http://localhost:9000/api/user/edit/${updatedUser._id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: updatedUser,
      };
      await axios.request(config);
      // Update the user in the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
      handleCloseEditModal();
      alert("User updated successfully"); // Replace with snackbar for better UX
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user"); // Replace with snackbar for better UX
    }
  };

  const handleChangeStatus = async (userId, newStatus) => {
    // Here you would make the API call to change the user's status
    try {
      const config = {
        method: "PUT",
        url: `http://localhost:9000/api/user/edit/${userId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          status: newStatus,
        },
      };
      await axios.request(config);
      // Update the user in the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
      alert("Status updated successfully"); // Replace with snackbar for better UX
      handleCloseStatusModal();
    } catch (error) {
      console.error("Error changing status:", error);
      alert("Failed to update status"); // Replace with snackbar for better UX
    }
  };

  return (
    <div className="content">
      <Sidebar />
      <Navbar />
      <h1>User Management</h1>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td className="table-wrap">{user.email}</td>
                <td>{user.status}</td>
                <td>{getRoleString(user.role)}</td>
                <td>
                  <div className="button-group">
                    <Button
                      className="button"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="button"
                      onClick={() => handleStatusClick(user)}
                    >
                      Change Status
                    </Button>
                    <Button
                      className="button"
                      onClick={() => handleDeleteClick(user._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {currentUser && (
        <EditUserModal
          open={isEditModalOpen}
          onClose={handleCloseEditModal}
          user={currentUser}
          updateUser={handleUpdateUser}
        />
      )}
      <StatusModal
        open={isStatusModalOpen}
        handleClose={handleCloseStatusModal}
        userId={selectedUserForStatusChange?._id}
        currentStatus={selectedUserForStatusChange?.status}
        handleChangeStatus={handleChangeStatus}
      />
    </div>
  );
};
export default UserManagement;
