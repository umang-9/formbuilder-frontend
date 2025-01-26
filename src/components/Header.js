import React from "react";
import { Button, Grid, Container, Flex, Space } from "@mantine/core";
import { useNavigate } from "react-router";
import { logoutUser } from "../services/api";

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    try {
      await logoutUser();
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header>
      <Container size="responsive">
        <Grid justify="space-between" align="center" text="white">
          
          <Grid.Col span={2}><h6>Leads &gt;&gt; add</h6></Grid.Col>
          
          <Grid.Col span="content">
            <Flex align="center">
              <h6>Form Editor</h6>
              <Space w="xl" />
              {user ? (
                <Button color="red" onClick={handleLogout}>Logout</Button>
              ) : (
                <Button onClick={() => navigate("/login")}>Login</Button>
              )}
            </Flex>
          </Grid.Col>
          
        </Grid>
      </Container>
    </header>
  );
};

export default Header;
