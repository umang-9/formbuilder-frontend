import React from "react";
import { Button, Card } from "@mantine/core";
import { useDrag } from "react-dnd";

const SidebarItem = ({ component }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FORM_COMPONENT",
    item: { type: component.id, defaultProps: component.defaultProps },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: "grab", marginBottom: "10px" }}>
      <Button fullWidth>{component.label}</Button>
    </div>
  );
};

const Sidebar = ({ formComponents }) => (
  <Card shadow="sm" padding="lg" radius="md" withBorder>
    {formComponents.map((comp) => (
      <SidebarItem key={comp.id} component={comp} />
    ))}
  </Card>
);

export default Sidebar;
