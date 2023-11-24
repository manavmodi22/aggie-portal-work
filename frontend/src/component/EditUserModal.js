// EditUserModal.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import '../css/Modal.css';

const roleMapping = {
  0: 'Admin',
  1: 'Mays Faculty',
  2: 'Employer/ Recruiter',
};

const statusMapping = {
  active: 'active',
  inactive: 'inactive',
  banned: 'banned',
  pending: 'pending',
  emailVerified: 'emailVerified',
};

// Update your EditUserModal component
const EditUserModal = ({ open, onClose, user, updateUser }) => {
  const [editedUser, setEditedUser] = useState({});
  const [isEditing, setIsEditing] = useState({
    firstName: false,
    lastName: false
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setEditedUser({
        ...user,
        // Ensure role and status are set correctly
        role: roleMapping[user.role.toString()], // Convert to string if it's not already
        status: user.status // Assuming status is already in the correct format
      });
    }
  }, [user]);

  // Function to handle the editing of fields
  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleCancelEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: false });
    setEditedUser({ ...editedUser, [field]: user[field] }); // Revert to original value
  };

  const handleConfirmEdit = (field, newValue) => {
    setIsEditing({ ...isEditing, [field]: false });
    setEditedUser({ ...editedUser, [field]: newValue });
  };

  // Function to handle changes in text fields
  const handleTextFieldChange = (event, field) => {
    setEditedUser({ ...editedUser, [field]: event.target.value });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    // Update state with the new value
    setEditedUser({ ...editedUser, [name]: value });
};

  const handleSubmit = async () => {
    try {
      // Convert role back to a number before submitting
      const submissionData = {
        ...editedUser,
        role: Object.keys(roleMapping).find(key => roleMapping[key] === editedUser.role),
      };
  
      // Make the API call to update the user with the converted role
      await updateUser(submissionData);
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating user:', error);
      // Show an error message
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <Typography variant="subtitle1">User ID: {user._id}</Typography>
        </FormControl>

        {['firstName', 'lastName'].map((field) => (
          <FormControl fullWidth margin="normal" key={field}>
            <TextField
              label={field.charAt(0).toUpperCase() + field.slice(1)} // Capitalize the first letter
              type="text"
              value={editedUser[field]}
              onChange={(event) => handleTextFieldChange(event, field)}
              InputProps={{
                endAdornment: !isEditing[field] ? (
                  <IconButton onClick={() => handleEditClick(field)}>
                    <EditIcon />
                  </IconButton>
                ) : (
                  <>
                    <IconButton onClick={() => handleConfirmEdit(field, editedUser[field])}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton onClick={() => handleCancelEdit(field)}>
                      <CloseIcon />
                    </IconButton>
                  </>
                ),
              }}
            />
          </FormControl>
        ))}

<FormControl fullWidth margin="normal">
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            label="Role"
            name="role"
            value={editedUser.role || ''} // Fallback to empty string if undefined
            onChange={handleSelectChange}
          >
            {/* Update these to match the roleMapping */}
            {Object.entries(roleMapping).map(([key, value]) => (
              <MenuItem key={key} value={value}>{value}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              name="status"
              value={editedUser.status || ''} // Fallback to empty string if undefined
              onChange={handleSelectChange}
            >
            {/* Update these to match the statusMapping */}
            {Object.keys(statusMapping).map((key) => (
              <MenuItem key={key} value={key}>{statusMapping[key]}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions className="button-container">
        <Button onClick={onClose} className="button">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="button">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserModal;