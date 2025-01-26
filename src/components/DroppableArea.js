import React, { useState } from "react";
import { useDrop, useDrag } from "react-dnd";
import { Paper, TextInput, Checkbox, Select, Textarea, Radio, Button, ActionIcon } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconTrash } from "@tabler/icons-react";
import "@mantine/dates/styles.css";

const componentMap = {
  text: TextInput,
  textarea: Textarea,
  checkbox: Checkbox,
  radio: Radio.Group,
  select: Select,
  date: DateInput,
  button: Button,
};

const DroppableArea = ({ formFields = [], setFormFields, setSelectedField }) => {
  
  const [, drop] = useDrop({
    accept: "FORM_COMPONENT",
    drop: (item) => {
      const newField = {
        id: Date.now(),
        type: item.type,
        defaultProps: {
          label: item.type === "button" ? "Submit" : `New ${item.type}`,
          placeholder: item.type !== "button" ? `Enter ${item.type}...` : "",
          required: false,
          options: item.type === "radio" || item.type === "select" ? ["Option 1", "Option 2"] : [],
        },
      };
      setFormFields((prevFields) => Array.isArray(prevFields) ? [...prevFields, newField] : [newField]);

    },
  });

  // Function to remove a form field from canvas
  const removeField = (id) => {
    setFormFields((prevFields) => prevFields.filter((field) => field.id !== id));
  };


  // Move fields on canvas
  const moveField = (dragIndex, hoverIndex) => {
    const reorderedFields = [...formFields];
    const [movedItem] = reorderedFields.splice(dragIndex, 1);
    reorderedFields.splice(hoverIndex, 0, movedItem);
    setFormFields(reorderedFields);
  };

  return (
    <div ref={drop} style={{ minHeight: "300px", padding: "10px", border: "2px dashed #ccc" }}>
      {formFields.length > 0 ? (
        formFields.map((field, index) => {
          const Component = componentMap[field.type] || TextInput;
          return (
            <DraggableField
              key={field.id}
              index={index}
              field={field}
              Component={Component}
              setSelectedField={setSelectedField}
              moveField={moveField}
              removeField={removeField}
            />
          );
        })
      ) : (
        <p style={{ textAlign: "center", color: "#888" }}>Drop form components here</p>
      )}
    </div>
  );
};

const DraggableField = ({ index, field, Component, setSelectedField, moveField, removeField }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "FORM_FIELD",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "FORM_FIELD",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveField(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const { validationRule, required, ...safeProps } = field.defaultProps || {};

  return (
    <Paper
      ref={(node) => drag(drop(node))}
      padding="md"
      style={{
        marginBottom: "20px",
        cursor: "move",
        opacity: isDragging ? 0.5 : 1,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
      }}
      onClick={() => setSelectedField(field)}
    >
      <div style={{ flexGrow: 1 }}>
        {field.type === "date" ? (
          <DateInput
            {...safeProps}
            clearable
            leftSection="📅"
            placeholder="Select a date"
            styles={{
              input: { width: "100%" },
              dropdown: { zIndex: 9999 },
            }}
          />
        ) : field.type === "button" ? (
          <Button {...safeProps}>{safeProps.label}</Button>
        ) : field.type === "radio" ? (
          <Component label={safeProps.label + (required ? " *" : "")}>
            {safeProps.options.map((option, idx) => (
              <Radio key={idx} value={option} label={option} />
            ))}
          </Component>
        ) : (
          <Component {...safeProps} label={safeProps.label + (required ? " *" : "")} />
        )}
      </div>
  
      {/* Delete button */}
      <ActionIcon color="red" variant="light" onClick={() => removeField(field.id)}>
        <IconTrash size={16} />
      </ActionIcon>

      
    </Paper>
  );
};

export default DroppableArea;
