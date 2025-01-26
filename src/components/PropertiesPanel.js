import React, { useState, useEffect } from "react";
import { TextInput, Checkbox, Button, Select, Group, Space } from "@mantine/core";

const PropertiesPanel = ({ selectedField, setSelectedField, setFormFields, formFields }) => {
  const [label, setLabel] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [required, setRequired] = useState(false);
  const [validationRule, setValidationRule] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (selectedField && selectedField.defaultProps) {
      setLabel(selectedField.defaultProps.label || "");
      setPlaceholder(selectedField.defaultProps.placeholder || "");
      setRequired(selectedField.defaultProps.required || false);
      setValidationRule(selectedField.defaultProps.validationRule || "");
      setOptions(selectedField.defaultProps.options || []);
    }
  }, [selectedField]);


  // Save function
  const saveProperties = () => {
    const updatedFields = formFields.map((field) =>
      field.id === selectedField.id
        ? {
            ...field,
            defaultProps: {
              ...field.defaultProps,
              label,
              placeholder,
              required,
              validationRule,
              options,
            },
          }
        : field
    );

    setFormFields(updatedFields);
    setSelectedField(null);
  };

  // Cancel function
  const cancelChanges = () => {
    setSelectedField(null);
  };

  // Update option
  const updateOption = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };


  // Add option
  const addOption = () => {
    setOptions([...options, `Option ${options.length + 1}`]);
  };

  // Remove option
  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };
  
  if (!selectedField) {
    return null;
  }

  return (
    <div style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
      
      <h4>Edit Field Properties</h4>
      
      <TextInput 
        label="Label Name" 
        value={label || ""} 
        onChange={(e) => setLabel(e.target.value)} 
      />

      <Space h="sm" />
      
      {selectedField.type !== "checkbox" && selectedField.type !== "radio" && (
        <TextInput
          label="Placeholder Text"
          value={placeholder || ""}
          onChange={(e) => setPlaceholder(e.target.value)}
        />
      )}

      <Space h="sm" />
      
      <Checkbox
        label="Required Field"
        checked={required}
        onChange={(event) => setRequired(event.currentTarget.checked)}
      />
      
      <Space h="sm" />
      
      <Select
        label="Validation Rule"
        value={validationRule || "none"}
        onChange={setValidationRule}
        data={[
          { value: "none", label: "None" },
          { value: "email", label: "Email Format" },
          { value: "numeric", label: "Only Numbers" },
          { value: "custom", label: "Custom Regex" },
        ]}
      />

      <Space h="sm" />

      {(selectedField.type === "radio" || selectedField.type === "select") && (
        <>
          <h5>Options</h5>
          {options.map((option, index) => (
            <Group key={index}>
              <TextInput
                value={option || ""}
                onChange={(e) => updateOption(index, e.target.value)}
              />
              <Button color="red" onClick={() => removeOption(index)}>X</Button>
            </Group>
          ))}
          {selectedField.type !== "checkbox" && (
            <Button fullWidth onClick={addOption} style={{ marginTop: "5px" }}>
              Add Option
            </Button>
          )}
        </>
      )}

      <Button fullWidth onClick={saveProperties} style={{ marginTop: "10px" }}>
        Save
      </Button>
      <Button fullWidth variant="outline" onClick={cancelChanges} style={{ marginTop: "5px" }}>
        Cancel
      </Button>
    </div>
  );
};

export default PropertiesPanel;
