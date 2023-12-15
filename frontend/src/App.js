import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import Login from "./component/login";
import Home from "./pages/Home";
import Profile from "./component/Profile";
import Signup from "./component/Signup";
import VerifyEmail from "./component/CodeVerification";
import UserManagement from "./component/UserManagement";
import StudentManagement from "./component/StudentManagement";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/code-verify" element={<VerifyEmail />} />
        <Route path="/admin/user-management" element={<UserManagement />} />
        <Route
          path="/admin/student-management"
          element={<StudentManagement />}
        />
      </Routes>
    </Router>
  );
};

export default App;

// const App = () => {
//     return (
//         <div className = 'app'>
//                 <Router>
//                     <Routes element={<Layout />}>
//                         {/* <Route path="/" element={<Login />} />
//                         <Route path="/home" element={<Home />} />
//                         <Route path="/profile" element={<Profile />} />
//                         <Route path="/signup" element={<Signup />} />
//                         <Route path="/code-verify" element={<VerifyEmail />} /> */}
//                         <Route path="/dashboard" element={<Dashboard />} />
//                     </Routes>
//                 </Router>
//         </div>
//     );
// };

// export default App;
