import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api";

// Retrieve authentication token from SessionStorage
const getAuthToken = () => sessionStorage.getItem("auth_token");

// Axios default headers for Auth
const authHeaders = () => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

// Register User
export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error.response?.data);
    throw error.response?.data || "Registration failed";
  }
};

// Login User
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    const { token } = response.data;

    if (token) {
      sessionStorage.setItem("auth_token", token);
      sessionStorage.setItem("user", JSON.stringify(response.user));
      console.log("Token stored:", token);
    } else {
      console.error("Token not received from API response.");
    }

    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.response?.data);
    throw error.response?.data || "Login failed";
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/logout`, {}, authHeaders());
    sessionStorage.removeItem("auth_token"); 
    sessionStorage.removeItem("user");
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error.response?.data);
    throw error.response?.data || "Logout failed";
  }
};

// Fetch Forms
export const getForms = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/forms/list`, authHeaders());
    console.log("Fetched Forms:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching forms:", error.response?.data);
    throw error.response?.data || "Fetching forms failed";
  }
};

// Save Form
export const saveForm = async (formData) => {
  try {
    const payload = {
      title: formData.title || "Untitled Form",
      fields: formData.fields && formData.fields.length > 0 ? formData.fields : [{ id: Date.now(), type: "text", props: {} }], // Default field to prevent 400 error
    };

    console.log("Saving Form Payload:", payload);

    const response = await axios.post(`${API_BASE_URL}/forms/save`, payload, authHeaders());
    return response.data;
  } catch (error) {
    console.error("Error saving form:", error.response?.data || error);
    throw error.response?.data || "Form save failed";
  }
};

//Fetch Single Form
export const getFormById = async (formId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/forms/${formId}`, authHeaders());
    return response.data;
  } catch (error) {
    console.error("Error fetching form:", error.response?.data);
    // throw error.response?.data || "Fetching form failed";
    return null; 
  }
};

//Delete Form
export const deleteForm = async (formId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/forms/delete/${formId}`, authHeaders());
    return response.data;
  } catch (error) {
    console.error("Error deleting form:", error.response?.data);
    throw error.response?.data || "Form delete failed";
  }
};
