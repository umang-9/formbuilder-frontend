import React, { useState, useEffect } from 'react';
import { Container, Group, Button, Grid, TextInput, Space, Card } from '@mantine/core';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { showNotification } from '@mantine/notifications';
import Sidebar from './Sidebar';
import DroppableArea from './DroppableArea';
import PropertiesPanel from './PropertiesPanel';
import Header from './Header';
import { formComponents } from './formComponents';
import FormList from "./FormList";
import { saveForm, getForms, deleteForm, getFormById } from '../services/api';

const FormBuilder = () => {
    const [forms, setForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [selectedField, setSelectedField] = useState(null);
    const [previewMode, setPreviewMode] = useState(false);
    const [user, setUser] = useState(sessionStorage.getItem("auth_token") || null);
    const [formFields, setFormFields] = useState([]);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await getForms();
                console.log("Fetched Forms:", response);
                setForms(response || []);
                if (response.length > 0) {
                    setSelectedForm(response[0].id);
                    setFormFields(JSON.parse(response[0].form_data || "[]"));
                }
            } catch (error) {
                console.error("Error fetching forms:", error);
                showNotification({
                    title: "Error",
                    message: "Failed to fetch forms",
                    color: "red",
                });
            }
        };

        fetchForms();
    }, []);

    // Fetch data of selected form
    const handleSelectForm = async (formId) => {
        console.log("Selecting Form ID:", formId); 
        setSelectedForm(formId);
        try {
            const form = await getFormById(formId);
            if (form) {
                console.log("Selected Form Data:", form);
                const formData = JSON.parse(form.form_data || "[]");
                setFormFields(Array.isArray(formData) ? formData : []);
            } else {
                showNotification({
                    title: "Error",
                    message: "Form not found or unauthorized",
                    color: "red",
                });
                setFormFields([]);
                setSelectedForm(null);
            }
        } catch (error) {
            console.error("Error fetching form data:", error);
        }
    };
    

    // Add a new form
    const addNewForm = async () => {
        const newForm = {
            title: `New Form ${forms.length + 1}`, 
            fields: [{ id: Date.now(), type: "text", props: {} }],
        };
    
        try {
            const savedForm = await saveForm(newForm);
            console.log("New Form Created:", savedForm);
    
            setForms([...forms, savedForm]);
            setSelectedForm(savedForm.id);
            setFormFields(savedForm.fields);
            setSelectedField(null);
    
            showNotification({
                title: "Success",
                message: "New form added successfully",
                color: "green",
            });
        } catch (error) {
            console.error("Error adding new form:", error);
            showNotification({
                title: "Error",
                message: error.message || "Failed to add form",
                color: "red",
            });
        }
    };
    
    // Remove form
    const removeForm = async (formId) => {
        try {
            const response = await deleteForm(formId);
            if (response && response.message === "Form deleted successfully") {
                const updatedForms = forms.filter((form) => form.id !== formId);
                setForms(updatedForms);
                setSelectedForm(updatedForms.length > 0 ? updatedForms[0].id : null);
                setSelectedField(null);
                showNotification({
                    title: "Success",
                    message: "Form removed successfully",
                    color: "green",
                });
            } else {
                showNotification({
                    title: "Error",
                    message: "Failed to delete form",
                    color: "red",
                });
            }
        } catch (error) {
            console.error("Error deleting form:", error);
            showNotification({
                title: "Error",
                message: error.response?.data?.error || "Failed to delete form",
                color: "red",
            });
        }
    };

    // Update form title
    const updateFormTitle = (title) => {
        setForms(forms.map((form) =>
            form.id === selectedForm ? { ...form, form_name: title } : form
        ));
    };

    // Save form
    const saveFormToServer = async () => {
        try {
            const formData = forms.find((form) => form.id === selectedForm);
            if (!formData) {
                showNotification({
                    title: "Warning",
                    message: "No form selected!",
                    color: "yellow",
                });
                return;
            }

            if (!formFields || formFields.length === 0) {
                showNotification({
                    title: "Warning",
                    message: "Cannot save an empty form. Please add fields.",
                    color: "yellow",
                });
                return;
            }

            const formattedFormData = {
                title: formData.title,
                fields: formFields,
            };

            await saveForm(formattedFormData);
            showNotification({
                title: "Success",
                message: "Form saved successfully!",
                color: "green",
            });
        } catch (error) {
            console.error("Error saving form:", error);
            showNotification({
                title: "Error",
                message: "Failed to save form",
                color: "red",
            });
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            
            {/* Header */}
            <Header user={user} setUser={setUser} />

            <Space h="lg" />

            <Container fluid>
                
                {/* Preview mode and Add New button */}
                <Group>
                    <Button color="indigo" onClick={() => setPreviewMode(!previewMode)}>
                        {previewMode ? "Back to Edit Mode" : "Preview Form"}
                    </Button>
                    {!previewMode && (
                        <Button color="indigo" onClick={addNewForm}>Add New Form</Button>
                    )}
                </Group>

                {/* Main Block start */}
                <Grid columns={12}>
                    
                    {/* Sidebar */}
                    <Grid.Col span={3}>
                        {!previewMode && (
                            <Sidebar formComponents={formComponents} />
                        )}
                    </Grid.Col>

                    {/* Form builder canvas */}
                    <Grid.Col span={6}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <TextInput
                                label="Form Title"
                                value={selectedForm ? forms.find((form) => form.id === selectedForm)?.form_name || "" : ""}
                                onChange={(e) => updateFormTitle(e.target.value)}
                                placeholder="Enter form title"
                            />
                            <Space h="md" />
                            <DroppableArea
                                formFields={formFields}
                                setFormFields={setFormFields}
                                setSelectedField={setSelectedField}
                            />
                            <Space h="md" />
                            <Group>
                                <Button color="blue" onClick={saveFormToServer}>Save Form</Button>
                                <Button color="red" onClick={() => removeForm(selectedForm)}>Remove Form</Button>
                            </Group>
                        </Card>
                    </Grid.Col>

                    {/* Properties Panel */}
                    <Grid.Col span={3}>
                        {selectedField && !previewMode && (
                            <PropertiesPanel
                                selectedField={selectedField}
                                setSelectedField={setSelectedField}
                                setFormFields={setFormFields}
                                formFields={formFields}
                            />
                        )}
                    </Grid.Col>
                    
                    <Space h="md" />

                    {/* List of previously created forms */}
                    <Grid.Col offset={3} span={6}>
                        <FormList forms={forms} setSelectedForm={handleSelectForm} />
                    </Grid.Col>
                </Grid>

                <Space h="xl" />
            </Container>
        </DndProvider>
    );
};

export default FormBuilder;
