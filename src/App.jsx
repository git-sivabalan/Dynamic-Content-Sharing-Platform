import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Home from './components/Home';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PostContent from './components/PostContent';
import Footer from './components/Footer';
import Profile from './components/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_BACKEND_URL}/auth/verify-token`,
          { token }
        );

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('authToken'); // Remove invalid token
        }
      } catch (error) {
        console.error("Token validation error:", error);
        setIsAuthenticated(false);
        localStorage.removeItem('authToken'); // Remove invalid token
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  // PublicRoute component: Accessible by everyone (authenticated or not)
  const PublicRoute = ({ children }) => children;

  // ProtectedRoute component: Restricts access to authenticated users
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>; // Show a loader while validating
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login setIsAuthenticated={setIsAuthenticated} /></PublicRoute>} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
               <div className="flex flex-col">
               <Home />
               <Footer/>
               </div>
              </ProtectedRoute>
            }
          />
            <Route
            path="/post"
            element={
              <ProtectedRoute>
               <div className="flex flex-col">
               <PostContent />
               <Footer/>
               </div>
              </ProtectedRoute>
            }
          />
           <Route
            path="/profile"
            element={
              <ProtectedRoute>
               <div className="flex flex-col">
               <Profile />
               <Footer/>
               </div>
              </ProtectedRoute>
            }
          />

          {/* Redirect any undefined routes */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
