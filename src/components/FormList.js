import React from "react";
import { Card, Button, Space } from "@mantine/core";

const FormList = ({ forms, setSelectedForm }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <h4>Saved Forms</h4>
      <Space h="md" />
      {forms.length === 0 ? (
        <p>No forms created yet.</p>
      ) : (
        forms.map((form) => (
          <Button
            key={form.id}
            fullWidth
            style={{ marginBottom: "5px" }}
            onClick={() => setSelectedForm(form.id)}
          >
            {form.form_name || "Untitled Form"}
          </Button>
        ))
      )}
    </Card>
  );
};

export default FormList;
