import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router";
import { loginUser } from "../services/api";
import {
  Container,
  Card,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Stack,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password.trim()) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await loginUser(email, password);
      console.log("Login API Response:", response);

      if (response.token) {
        sessionStorage.setItem("auth_token", response.token);

        const userResponse = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${response.token}` },
        });

        if (userResponse.data) {
          sessionStorage.setItem("user", JSON.stringify(userResponse.data));
          setUser(userResponse.data);

          notifications.show({
            title: "Success",
            message: "Login successful!",
            color: "green",
          });

          setTimeout(() => navigate("/"), 1000);
        }
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error);

      notifications.show({
        title: "Error",
        message: error.response?.status === 401 ? "Invalid credentials. Try again." : "An error occurred.",
        color: "red",
      });
    }
  };

  return (
    <Container size={420} my={50}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title align="center" order={2} mt="md" mb="lg">
          Welcome Back!
        </Title>

        <form onSubmit={handleLogin}>
          <Stack>
            <TextInput 
              label="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              error={errors.email}
            />
            <PasswordInput 
              label="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              error={errors.password} 
            />
            <Button type="submit" fullWidth mt="md">
              Login
            </Button>
          </Stack>
        </form>

        <Text size="sm" align="center" mt="md">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </Text>
      </Card>
    </Container>
  );
};

export default Login;
