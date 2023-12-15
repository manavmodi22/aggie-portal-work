const express = require("express");
const router = express.Router();
const {
  allUsers,
  singleUser,
  editUser,
  deleteUser,
  approveAccess,
  searchUsers,
} = require("../controllers/userController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// User routes

// Fetch all users - /api/allusers
//router.get('/allusers', isAuthenticated, isAdmin, allUsers);

router.get("/allusers", allUsers);

// Fetch a single user - /api/user/:id
router.get("/search", isAuthenticated, searchUsers);

// Edit user details - /api/user/edit/:id
router.put("/user/edit/:id", editUser);

// Approve user access (change status from "emailVerified" to "approved") - /api/user/approve/:id
//router.put('/user/approve/:id', isAuthenticated, isAdmin, approveAccess);

// Delete a user - /api/admin/user/delete/:id
router.delete("/admin/user/delete/:id", deleteUser);

// Search users based on query - /api/users/search
router.get("/users/search", isAuthenticated, searchUsers);

module.exports = router;
