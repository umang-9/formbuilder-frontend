import { TextInput, Checkbox, Select, Textarea, Radio, Button } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

export const formComponents = [
  { id: "text", label: "Text Input", defaultProps: { placeholder: "Enter text", label: "Text Input" } },
  { id: "textarea", label: "Textarea", defaultProps: { placeholder: "Enter text", label: "Textarea" } },
  { id: "checkbox", label: "Checkbox", defaultProps: { label: "Checkbox" } },
  { id: "radio", label: "Radio Buttons", defaultProps: { label: "Choose one", options: ["Option 1", "Option 2"] } },
  { id: "select", label: "Select Dropdown", defaultProps: { label: "Select an option", data: ["Option 1", "Option 2"] } },
  { id: "date", label: "Date Picker", defaultProps: { label: "Pick a date" } },
  { id: "button", label: "Submit Button", defaultProps: { label: "Submit", fullWidth: true } },
];
