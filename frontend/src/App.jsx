// frontend/src/App.jsx
import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import PatientsPage from "./pages/PatientsPage";
import PatientView from "./pages/PatientView";
import PatientEdit from "./pages/PatientEdit";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";

// Minimal ProtectedRoute using localStorage token
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("ml_token");
  if (!token) return <Navigate to="/signin" replace />;
  return children;
}

function App() {
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <Navbar />

      <Routes>
        {/* Public auth routes */}
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected app routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <PatientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/:id"
          element={
            <ProtectedRoute>
              <PatientView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/:id/edit"
          element={
            <ProtectedRoute>
              <PatientEdit />
            </ProtectedRoute>
          }
        />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
}

export default App;
