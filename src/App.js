import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router";
import axios from "axios";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import FormBuilder from './components/FormBuilder';

import Login from "./pages/Login";
import Register from "./pages/Register";

// CSS Files 
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './App.css';

function App() {
  const getUserFromStorage = () => {
    try {
      const userData = sessionStorage.getItem("user");
      console.log("userData", userData);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data from sessionStorage:", error);
      return null;
    }
  };

  const [user, setUser] = useState(getUserFromStorage);

  useEffect(() => {
    const checkUserAuth = async () => {
      const token = sessionStorage.getItem("auth_token");
      if (!token) return;

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setUser(response.data);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        handleLogout();
      }
    };

    checkUserAuth();
  }, []);

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("user");
  };

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications position="top-right" zIndex={1000} />
      <Router>
        <Routes>
          <Route path="/" element={user ? <FormBuilder /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
