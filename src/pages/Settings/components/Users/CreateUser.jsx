import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import './CreateUser.css';
import HttpClient from '../../../../api/HttpClient';

function CreateUser(props) {
    const [validated, setValidated] = useState(false);
    const [apiError, setApiError] = useState("");
    const [error, setError] = useState('');
    const [formValues, setFormValues] = useState({
        full_name: "",
        email: "",
        organization: "",
        password: "",
        confirm_pass: "",
        is_active: false,
        is_admin: false
    });

    useEffect(() => console.log(apiError), [apiError]);

    function handleInputChangeUser(key, value) {
        setFormValues((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    }

    const handleCreateUser = (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log(formValues);
        const form = event.currentTarget;

        const password = formValues.password;
        const confirmPassword = formValues.confirm_pass;

        // Check password match
        if (password !== confirmPassword) {
            setError('Passwords do not match!');
        } else {
            setError('');
        }

        if (form.checkValidity() && password === confirmPassword) {
            let data = formValues;
            data.confirm_pass = undefined;

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // Add this if you're using authentication
                    // 'Authorization': `Bearer ${your_token_here}`,
                },
                // Enable credentials if your API requires them
                // withCredentials: true,
            }

            HttpClient.post("/users/create", data, config)
                .then(response => {
                    console.log(response.data);
                    console.log("----call-------");
                    props.setSliderState(false);
                })
                .catch(error => {
                    if (error.response) {
                        setApiError(error.response.data.message)
                    } else if (error.request) {
                        setApiError(error.request)
                    } else {
                        setApiError(error.message)
                    }
                })
        }

        setValidated(true);
    };

    return (
        <Container fluid>
            <Form noValidate validated={validated} onSubmit={handleCreateUser}>
                <Form.Group className="mb-3" controlId="fgFullName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        required
                        size="lg"
                        type="text"
                        value={formValues.full_name}
                        onChange={(e) => handleInputChangeUser("full_name", e.target.value)}
                        placeholder="Enter full name"
                        style={{ fontSize: "16px" }}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a name.
                    </Form.Control.Feedback>
                    {/* {validationErrors.firstName && <p className="error-msg">{validationErrors.firstName}</p>} */}
                </Form.Group>
                <Form.Group className="mb-3" controlId="fgEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        required
                        size="lg"
                        type="email"
                        value={formValues.email}
                        onChange={(e) => handleInputChangeUser("email", e.target.value)}
                        placeholder="Enter email"
                        style={{ fontSize: "16px" }}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter an email.
                    </Form.Control.Feedback>
                    {/* {validationErrors.email && <p className="error-msg">{validationErrors.email}</p>} */}
                </Form.Group>
                <Form.Group className="mb-3" controlId="fgOrganization">
                    <Form.Label>Organization</Form.Label>
                    <Form.Control
                        size="lg"
                        type="text"
                        value={formValues.organization}
                        onChange={(e) => handleInputChangeUser("organization", e.target.value)}
                        placeholder="Enter organization name"
                        style={{ fontSize: "16px" }}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="fgPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                        size="lg"
                        type="password"
                        value={formValues.password}
                        onChange={(e) => handleInputChangeUser("password", e.target.value)}
                        placeholder="Enter password"
                        style={{ fontSize: "16px" }}

                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter an password.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="fgConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        required
                        size="lg"
                        type="password"
                        value={formValues.confirm_pass}
                        onChange={(e) => handleInputChangeUser("confirm_pass", e.target.value)}
                        placeholder="Confirm password"
                        style={{ fontSize: "16px" }}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please confirm password.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Set Flags:</Form.Label>
                    <div className="d-flex flex-row">
                        <Form.Check
                            type="checkbox"
                            label="Active"
                            onChange={(e) => handleInputChangeUser('is_active', e.target.checked)}
                            className="me-3"
                        />
                        <Form.Check
                            type="checkbox"
                            label="Admin"
                            onChange={(e) => handleInputChangeUser('is_admin', e.target.checked)}
                            className="me-3"
                        />
                    </div>
                </Form.Group>

                {/* Custom Error Message */}
                {error && <p className="text-danger">{error}</p>}

                <Button variant='secondary' type='submit'>Create</Button>
            </Form>
        </Container>
    );
}

export default CreateUser;