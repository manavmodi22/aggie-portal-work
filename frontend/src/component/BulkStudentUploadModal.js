import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Typography, LinearProgress, Snackbar, Alert, IconButton
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const BulkStudentUploadModal = ({ open, onClose, refreshStudents }) => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setTotalBytes(event.target.files[0].size);
  };

  const handleUpload = async () => {
    if (!file) {
      setSnackbarMessage('Please select a file to upload');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('http://localhost:9000/api/students/create/excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          setUploadedBytes(progressEvent.loaded);
          setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      });
  
      if (response.status === 201) {
        setSnackbarMessage('Upload successful');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        refreshStudents();
        onClose();
        resetUploadState();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error.response && error.response.data && error.response.data.error
                           ? error.response.data.error
                           : 'Error during upload. Please check the file and try again.';
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const resetUploadState = () => {
    setUploadProgress(0);
    setUploadedBytes(0);
    setTotalBytes(0);
    setFile(null);
  };

  const handleCloseModal = () => {
    resetUploadState();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          Bulk Upload Students
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
        />
        <Typography variant="body2" color="textSecondary">
          Accepted formats: .xlsx, .xls | Max size: 50 MB
        </Typography>
        {uploadProgress > 0 && (
          <>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="body2" color="textSecondary">
              {`${(uploadedBytes / 1024 / 1024).toFixed(2)} MB of ${(totalBytes / 1024 / 1024).toFixed(2)} MB uploaded`}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleUpload} startIcon={<UploadFileIcon />} color="primary">
          Upload
        </Button>
      </DialogActions>
      <Snackbar open={snackbarOpen} autoHideDuration={8000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default BulkStudentUploadModal;
