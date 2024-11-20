import React, { useState, useRef, useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Alert from 'react-bootstrap/Alert'
import { useNavigate } from 'react-router-dom'
//
import HttpClient from '../../../api/HttpClient'
import { toast } from 'react-toastify'
//
const showPassword = <i className="las la-eye" style={{ cursor: "pointer" }}></i>
const hidePassword = <i className="las la-eye-slash" style={{ cursor: "pointer" }}></i>

const CreatePurchaseOrder = (props) => {
  const navigate = useNavigate()
  const passwordRef = useRef(null)
  //
  const [apiError, setApiError] = useState('')
  const [spinner, showSpinner] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [passwordShown, setPasswordShown] = useState(false)
  //
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userLevel, setUserLevel] = useState(0)
  const [selectedRoles, setSelectedRoles] = useState([])


  useEffect(() => {
    //checkUserSession()
  }, [])

  // check session user exists otherwise logout
  const checkUserSession = () => {
    HttpClient.get('auth/me')
      .then(responsePayload => {
        // set the user object from the session
        // setSessionUser(responsePayload.data.data)
      })
      .catch(error => {
        // in case of any error take the user to login page as this is unauthorized
        navigate("/")
      })
  }

  // handle create user
  const handleCreateUser = (e) => {
    e.preventDefault()
    setApiError('')
    setValidationErrors({})
    showSpinner(true)

    // perform form validation
    const validationErrors = formValidation()
    const noErrors = Object.keys(validationErrors).length === 0;
    if (!noErrors) {
      setValidationErrors(validationErrors)
      showSpinner(false)
      return
    }

    // continue if no validation errors
    let formData = new FormData()
    formData.append('company_id', props.companyId)
    formData.append('first_name', firstName)
    formData.append('last_name', lastName)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('user_level', userLevel)
    formData.append('admin_roles', JSON.stringify(selectedRoles))



    HttpClient.post('user/create-user', formData)
      .then(responsePayload => {
        toast.success("User created successfully")
        showSpinner(false)
        // reset the form
        setFirstName('')
        setLastName('')
        setEmail('')
        setPassword('')
        passwordRef.current.value = ''
        props.updateSliderState({
          isPaneOpen: false,
        })

      })
      .catch(error => {
        showSpinner(false)
        if (error.response) {
          setApiError(error.response.data.message)
        } else if (error.request) {
          setApiError(error.request)
        } else {
          setApiError(error.message)
        }

        // reset the password on any error
        setPassword('')
        passwordRef.current.value = ''
      })
  }


  //
  const formValidation = () => {
    const validationErrors = {}

    // validate full name
    if (firstName.length === 0) {
      validationErrors.firstName = 'First name is required'
    }
    else if (firstName.length > 100) {
      validationErrors.firstName = 'First Name is too long (maximum is 100 characters)'
    }
    else if (!/^[a-zA-Z" " ]+$/.test(firstName)) {
      validationErrors.firstName = 'First name must be letters only'
    }

    // validate last name
    if (lastName.length === 0) {
      validationErrors.lastName = 'Last name is required'
    }
    else if (lastName.length > 100) {
      validationErrors.lastName = 'Last Name is too long (maximum is 100 characters)'
    }
    else if (!/^[a-zA-Z" " ]+$/.test(lastName)) {
      validationErrors.lastName = 'Last name must be letters only'
    }

    // validate email
    if (email.length === 0) {
      validationErrors.email = 'Email address is required'
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      validationErrors.email = 'Email address is invalid'
    }

    return validationErrors
  }

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  }

  const handleRoleChange = (e) => {
    const role = e.target.value
    if (e.target.checked) {
      setSelectedRoles([...selectedRoles, role])
    } else {
      setSelectedRoles(selectedRoles.filter((selectedRole) => selectedRole !== role))
    }
  }

  const [rows, setRows] = useState([
    { serviceName: "", vCPUs: "", ram: "", quantity: "", rate: "" },
  ]);

  // Handle input changes for a specific row
  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  // Add a new row
  const addRow = () => {
    setRows([
      ...rows,
      { serviceName: "", vCPUs: "", ram: "", quantity: "", rate: "" },
    ]);
  };

  // Remove a row
  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };


  //// handle storage states 

  // State to manage rows, renamed to storageService
  const [storageService, setStorageService] = useState([
    { service: "", type: "", gbs: "", duration: "730", price: "" },
  ]);

  // Handle input changes for a specific row
  const updateStorageService = (index, field, value) => {
    const updatedServices = [...storageService];
    updatedServices[index][field] = value;
    setStorageService(updatedServices);
  };

  // Add a new row
  const addStorageServiceRow = () => {
    setStorageService([
      ...storageService,
      { service: "", type: "", gbs: "", duration: "730", price: "" },
    ]);
  };

  // Remove a row
  const removeStorageServiceRow = (index) => {
    const updatedServices = storageService.filter((_, i) => i !== index);
    setStorageService(updatedServices);
  };


  useEffect(() => {
    console.log(rows)
  }, [rows])

  return (
    <Container fluid style={{ paddingRight: "0", paddingLeft: "0" }}>
      {
        apiError &&
        <>
          <div className="gutter-10x"></div>
          <Alert className="form-global-error">{apiError}</Alert>
          <div className="gutter-10x"></div>
        </>
      }
      <Form onSubmit={handleCreateUser}>
        <Row><Col><span style={{ font: "16px", fontWeight: 'bold' }}>User Info</span></Col></Row>
        <div className='gutter-20x' ></div>
        <Form.Group className="mb-3" controlId="fgFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            autoFocus={true}
            onChange={e => setFirstName(e.target.value)}
            placeholder="Enter first name"
            style={{ fontSize: "16px" }} />
          {
            validationErrors.firstName &&
            <p className="error-msg">{validationErrors.firstName}</p>
          }
        </Form.Group>
        <Form.Group className="mb-3" controlId="fgLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            onChange={e => setLastName(e.target.value)}
            placeholder="Enter last name"
            style={{ fontSize: "16px" }} />
          {
            validationErrors.lastName &&
            <p className="error-msg">{validationErrors.lastName}</p>
          }
        </Form.Group>
        <Form.Group className="mb-3" controlId="fgEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            size="lg"
            type="email"
            placeholder="Enter email"
            onChange={e => setEmail(e.target.value)}
            style={{ fontSize: "16px" }} />
          {
            validationErrors.email &&
            <p className="error-msg">{validationErrors.email}</p>
          }
        </Form.Group>
        <Form.Group className="mb-3" controlId="fgAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder="Enter Address"
            // onChange={e => setEmail(e.target.value)}
            style={{ fontSize: "16px" }} />
        </Form.Group>
        <div className='gutter-10x' ></div>
        <div className='splitter' ></div>
        <div className="gutter-20x"></div>
        <Row><Col><span style={{ font: "16px", fontWeight: 'bold' }}>Elastic Cloud Server/ Virtual Machines</span></Col></Row>
        <div className='gutter-20x' ></div>
        <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
          <Col lg={2}>
            <span>Virtual Machine</span>
          </Col>
          <Col lg={2}>
            <span>vCPUs</span>
          </Col>
          <Col lg={2}>
            <span>RAM (GB)</span>
          </Col>
          <Col lg={2}>
            <span>Quantity</span>
          </Col>
          <Col lg={3}>
            <span>Monthaly Per ECS (unit price)</span>
          </Col>
          <Col >
          </Col>
        </Row>
        <div className='gutter-20x' ></div>
        {rows.map((row, index) => (
          <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgServiceName-${index}`}>
                <Form.Control
                  size="lg"
                  type="text"
                  value={row.serviceName}
                  onChange={(e) => handleInputChange(index, "serviceName", e.target.value)}
                  placeholder="Service Name"
                  style={{ fontSize: "16px" }}
                />
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgCPUs-${index}`}>
                <Form.Select
                  aria-label=""
                  value={row.vCPUs}
                  onChange={(e) => handleInputChange(index, "vCPUs", e.target.value)}
                >
                  <option>Select vCPUs</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="8">8</option>
                  <option value="16">16</option>
                  <option value="32">32</option>
                  <option value="48">48</option>
                  <option value="64">64</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgRAM-${index}`}>
                <Form.Select
                  aria-label=""
                  value={row.ram}
                  onChange={(e) => handleInputChange(index, "ram", e.target.value)}
                >
                  <option>Select RAM</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="8">8</option>
                  <option value="16">16</option>
                  <option value="32">32</option>
                  <option value="48">48</option>
                  <option value="64">64</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgQuantity-${index}`}>
                <Form.Control
                  size="lg"
                  type="text"
                  value={row.quantity}
                  onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                  placeholder="Quantity"
                  style={{ fontSize: "16px" }}
                />
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgRate-${index}`}>
                <Form.Control
                  size="lg"
                  type="text"
                  value={row.rate}
                  onChange={(e) => handleInputChange(index, "rate", e.target.value)}
                  placeholder="Set Rate"
                  style={{ fontSize: "16px" }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Button
                variant="outline-primary"
                onClick={addRow}
                style={{ marginRight: "5px" }}
                disabled={index !== rows.length - 1}
              >
                Add
              </Button>
              {rows.length > 1 && (
                <Button variant="danger" onClick={() => removeRow(index)}>
                  Remove
                </Button>
              )}
            </Col>
          </Row>
        ))}
        <div className='gutter-10x' ></div>
        <div className='splitter' ></div>
        <div className="gutter-20x"></div>
        <Row><Col><span style={{ font: "16px", fontWeight: 'bold' }}>Storage Services</span></Col></Row>
        <div className='gutter-20x' ></div>
        <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
          <Col lg={2}>
            <span>Service Name</span>
          </Col>
          <Col lg={2}>
            <span>Type</span>
          </Col>
          <Col lg={2}>
            <span>Size (GB)</span>
          </Col>
          <Col lg={2}>
            <span>Duration (Hr / Month)</span>
          </Col>
          <Col>
            Monthly Price
          </Col>
        </Row>
        <div className='gutter-20x' ></div>
        {storageService.map((row, index) => (
          <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgService-${index}`}>
                <Form.Select
                  aria-label="Select Service"
                  value={row.service}
                  onChange={(e) => updateStorageService(index, "service", e.target.value)}
                >
                  <option>Select Service</option>
                  <option value="elastic">Elastic Volume Services</option>
                  <option value="obs">Object Storage Service (OBS)</option>
                  <option value="bv">Backup Vault</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgType-${index}`}>
                <Form.Select
                  aria-label="Select Type"
                  value={row.type}
                  onChange={(e) => updateStorageService(index, "type", e.target.value)}
                >
                  {row.service !== "" ?
                    <option>Select Type</option>
                    :
                    <option>Please First Select Service</option>
                  }
                  {row.service === "elastic" &&
                    <>
                      <option value="SSD">General Purpose SSD (Per GB)</option>
                      <option value="HHD">HDD (Per GB)</option>
                    </>
                  }
                  {row.service === "obs" && <option value="OBS">OBS for Object Data or IMS (Images)</option>}
                  {row.service === "bv" && <option value="OBS-Licence">Licence + OBS</option>}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgGBs-${index}`}>
                <Form.Control
                  size="lg"
                  type="text"
                  placeholder="GBs"
                  value={row.gbs}
                  onChange={(e) => updateStorageService(index, "gbs", e.target.value)}
                  style={{ fontSize: "16px" }}
                />
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgDuration-${index}`}>
                <Form.Control
                  size="lg"
                  type="text"
                  placeholder="Duration"
                  value={row.duration}
                  onChange={(e) => updateStorageService(index, "duration", e.target.value)}
                  style={{ fontSize: "16px" }}
                />
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgPrice-${index}`}>
                <Form.Control
                  size="lg"
                  type="text"
                  placeholder="Price"
                  value={row.price}
                  onChange={(e) => updateStorageService(index, "price", e.target.value)}
                  style={{ fontSize: "16px" }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Button
                variant="success"
                onClick={addStorageServiceRow}
                style={{ marginRight: "5px" }}
                disabled={index !== storageService.length - 1}
              >
                Add
              </Button>
              {storageService.length > 1 && (
                <Button variant="danger" onClick={() => removeStorageServiceRow(index)}>
                  Remove
                </Button>
              )}
            </Col>
          </Row>
        ))}
        <div className="d-grid gap-2">
          <Button
            size="lg"
            type="submit"
            style={{ fontSize: "16px", borderRadius: "20px", backgroundColor: "#2887d4" }}>
            {
              spinner ?
                <div>
                  <Spinner style={{ marginRight: 10, marginTop: 5 }} animation="border" size="sm" variant="light" role="status" />
                  Creating User ...
                </div>
                :
                <div>Create</div>
            }
          </Button>
        </div>
      </Form>
    </Container>
  )
}

export default CreatePurchaseOrder
