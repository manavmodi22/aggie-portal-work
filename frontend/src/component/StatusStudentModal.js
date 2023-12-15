import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import "../css/Modal.css";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const StudentStatusModal = ({
  open,
  handleClose,
  studentId,
  currentStatus,
  handleChangeStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const statuses = [
    "active",
    "inactive",
    "suspended",
    "pending",
    "emailVerified",
  ];

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleConfirm = () => {
    handleChangeStatus(studentId, selectedStatus);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          Change Student Status
        </Typography>
        <Typography sx={{ mt: 2 }}>Current status: {currentStatus}</Typography>
        <Select
          labelId="status-select-label"
          id="status-select"
          value={selectedStatus}
          label="Status"
          onChange={handleStatusChange}
          fullWidth
          sx={{ mt: 2 }}
        >
          {statuses
            .filter((status) => status !== currentStatus)
            .map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
        </Select>
        <Box
          sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
          className="button-container"
        >
          <Button onClick={handleClose} className="button">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="button">
            Confirm Change
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default StudentStatusModal;
