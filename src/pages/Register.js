import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { registerUser } from "../services/api";
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

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!name.trim()) newErrors.name = "Full Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await registerUser(name, email, password);
      notifications.show({
        title: "Success",
        message: "Registration successful! You can now log in.",
        color: "green",
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        notifications.show({
          title: "Error",
          message: error.message || "Registration failed. Try again.",
          color: "red",
        });
      }
    }
  };

  return (
    <Container size={420} my={50}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title align="center" order={2} mt="md" mb="lg">
          Create an Account
        </Title>

        <form onSubmit={handleRegister}>
          <Stack>
            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            <TextInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            <Button type="submit" fullWidth mt="md">
              Sign Up
            </Button>
          </Stack>
        </form>

        <Text size="sm" align="center" mt="md">
          Already have an account? <Link to="/login">Log in</Link>
        </Text>
      </Card>
    </Container>
  );
};

export default Register;
