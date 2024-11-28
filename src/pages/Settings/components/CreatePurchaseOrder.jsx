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
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    ntnNumber: "",
    address: "",
  });

  useEffect(() => {
    if (props.source === "user-update") {
      getUserRecord()
    }
  }, [])


  const handleInputChangeUser = (field, value) => {
    setFormValues((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    // Clear validation error for the field being updated
    if (validationErrors[field]) {
      setValidationErrors((prevState) => ({
        ...prevState,
        [field]: "",
      }));
    }
  }

  // handle create user
  const handleCreatePurchaseOrder = (e) => {
    e.preventDefault()
    setApiError('')
    setValidationErrors({})
    showSpinner(true)

    let ElasticService = {
      'serviceName': "elasticService",
      'data': rows
    }
    let StorageService = {
      'serviceName': "storageService",
      'data': storageService
    }
    let DrService = {
      'serviceName': "drService",
      'data': drServices
    }
    let ContainerServiceCCE = {
      'serviceName': "containerServices",
      'data': containerServices
    }
    let ContainerServiceWorker = {
      'serviceName': "containerServiceWorker",
      'data': containerSpecialServices
    }
    let SecurityProtection = {
      'serviceName': "securityServices",
      'data': securityServices
    }
    let DatabaseServices = {
      'serviceName': "databaseServices",
      'data': databaseServices
    }
    let NetworkServices = {
      'serviceName': "networkServices",
      'data': networkServices
    }


    let services = [
      ElasticService,
      StorageService,
      DrService,
      ContainerServiceCCE,
      ContainerServiceWorker,
      SecurityProtection,
      DatabaseServices,
      NetworkServices,
      additionalServices
    ]


    let UserPurchaseOrder = {
      "user-info": formValues,
      "services": services
    }

    console.log(JSON.stringify(UserPurchaseOrder))

    // perform form validation
    // const validationErrors = formValidation()
    // const noErrors = Object.keys(validationErrors).length === 0;
    // if (!noErrors) {
    //   setValidationErrors(validationErrors)
    //   showSpinner(false)
    //   return
    // }

    HttpClient.post('/po/add', UserPurchaseOrder)
      .then(responsePayload => {
        toast.success("PO recorded successfully")
        showSpinner(false)
        // reset the form
        // setFirstName('')
        // setLastName('')
        // setEmail('')
        // setPassword('')
        // passwordRef.current.value = ''
        // props.updateSliderState({
        //   isPaneOpen: false,
        // })

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
    { vCPUs: 0, ram: 0, quantity: 0, rate: 0, monthly_rate: 0 },
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
      { vCPUs: 0, ram: 0, quantity: 0, rate: 0, monthlyPrice: 0 },
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
    { serviceName: "", type: "", gbs: 0, duration: 730, price: 0 },
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
      { serviceName: "", type: "", gbs: 0, duration: 730, price: 0 },
    ]);
  };

  // Remove a row
  const removeStorageServiceRow = (index) => {
    const updatedServices = storageService.filter((_, i) => i !== index);
    setStorageService(updatedServices);
  };


  //// DR Services 


  // State to manage DR services
  const [drServices, setDrServices] = useState([
    { serviceName: "", type: "", quantity: 0, duration: 730, monthlyPrice: 0 },
  ]);

  // Handle input changes for a specific row
  const updateDrService = (index, field, value) => {
    const updatedServices = [...drServices];
    updatedServices[index][field] = value;
    setDrServices(updatedServices);
  };

  // Add a new row
  const addDrServiceRow = () => {
    setDrServices([
      ...drServices,
      { serviceName: "", type: "", quantity: 0, duration: 730, monthlyPrice: 0 },
    ]);
  };

  // Remove a row
  const removeDrServiceRow = (index) => {
    const updatedServices = drServices.filter((_, i) => i !== index);
    setDrServices(updatedServices);
  };


  // State to manage Container Services
  const [containerServices, setContainerServices] = useState([
    { serviceName: "CCE Cluster", description: "CCE Cluster", vcpuQty: 0, duration: 730, monthlyPrice: 0 },
  ]);

  // Handle input changes for a specific row
  const updateContainerService = (index, field, value) => {
    const updatedServices = [...containerServices];
    updatedServices[index][field] = value;
    setContainerServices(updatedServices);
  };

  // Add a new row
  const addContainerServiceRow = () => {
    setContainerServices([
      ...containerServices,
      { serviceName: "CCE Cluster", description: "CCE Cluster", vcpuQty: 0, duration: 730, monthlyPrice: 0 },
    ]);
  };

  // Remove a row
  const removeContainerServiceRow = (index) => {
    const updatedServices = containerServices.filter((_, i) => i !== index);
    setContainerServices(updatedServices);
  };

  const [containerSpecialServices, setContainerSpecialServices] = useState([
    { serviceName: "", description: "", vcpuQty: 0, duration: 730, monthlyPrice: 0 },
  ]);

  // Handle input changes for a specific row
  const updateContainerSpecialService = (index, field, value) => {
    const updatedServices = [...containerSpecialServices];
    updatedServices[index][field] = value;
    setContainerSpecialServices(updatedServices);
  };

  // Add a new row
  const addContainerSpecialServiceRow = () => {
    setContainerSpecialServices([
      ...containerSpecialServices,
      { serviceName: "", description: "", vcpuQty: 0, duration: 730, monthlyPrice: 0 },
    ]);
  };

  // Remove a row
  const removeContainerSpecialServiceRow = (index) => {
    const updatedServices = containerSpecialServices.filter((_, i) => i !== index);
    setContainerSpecialServices(updatedServices);
  };

  //////////////////////////////////////////////////////////////////////////////
  // State to manage Security and Protection Services
  const [securityServices, setSecurityServices] = useState([
    { serviceName: "", type: "", description: "", duration: 730, monthlyPrice: 0 },
  ]);

  // Handle input changes for a specific row
  const updateSecurityService = (index, field, value) => {
    const updatedServices = [...securityServices];
    updatedServices[index][field] = value;
    setSecurityServices(updatedServices);
  };

  // Add a new row
  const addSecurityServiceRow = () => {
    setSecurityServices([
      ...securityServices,
      { serviceName: "", type: "", description: "", duration: 730, monthlyPrice: 0 },
    ]);
  };

  // Remove a row
  const removeSecurityServiceRow = (index) => {
    const updatedServices = securityServices.filter((_, i) => i !== index);
    setSecurityServices(updatedServices);
  };


  ///  database 
  const [databaseServices, setDatabaseServices] = useState([
    { serviceName: "", type: "", qty: 0, duration: 730, monthlyPrice: 0 },
  ]);

  // Handle input changes for a specific row
  const updateDatabaseService = (index, field, value) => {
    const updatedServices = [...databaseServices];
    updatedServices[index][field] = value;
    setDatabaseServices(updatedServices);
  };

  // Add a new row
  const addDatabaseServiceRow = () => {
    setDatabaseServices([
      ...databaseServices,
      { serviceName: 1, type: "", qty: 0, duration: 730, monthlyPrice: 0 },
    ]);
  };

  // Remove a row
  const removeDatabaseServiceRow = (index) => {
    const updatedServices = databaseServices.filter((_, i) => i !== index);
    setDatabaseServices(updatedServices);
  }

  /// network Services 

  const [networkServices, setNetworkServices] = useState([
    { serviceName: 1, type: "", qty: 0, duration: 0, monthlyPrice: 0 },
  ]);

  // Handle input changes for a specific row
  const updateNetworkService = (index, field, value) => {
    const updatedServices = [...networkServices];
    updatedServices[index][field] = value;
    setNetworkServices(updatedServices);
  };

  // Add a new row
  const addNetworkServiceRow = () => {
    setNetworkServices([
      ...networkServices,
      { serviceName: "", type: "", qty: 0, duration: 0, monthlyPrice: 0 },
    ]);
  };

  // Remove a row
  const removeNetworkServiceRow = (index) => {
    const updatedServices = networkServices.filter((_, i) => i !== index);
    setNetworkServices(updatedServices);
  }

  /// value edit fields 
  const [additionalServices, setAdditionalServices] = useState({
    serviceName: "additionalServices",
    data: [], // Array to hold selected services with price and qty
  });


  // Handle checkbox changes
  const handleCheckboxChange = (serviceName) => {
    setAdditionalServices((prevState) => {
      const exists = prevState.data.some((service) => service.serviceName === serviceName);

      if (exists) {
        // Remove service if it already exists
        return {
          ...prevState,
          data: prevState.data.filter((service) => service.serviceName !== serviceName),
        };
      }

      // Add new service with default values
      return {
        ...prevState,
        data: [
          ...prevState.data,
          { serviceName, price: "", qty: "" },
        ],
      };
    });
  };

  // Handle price changes
  const handlePriceChange = (serviceName, price) => {
    setAdditionalServices((prevState) => ({
      ...prevState,
      data: prevState.data.map((service) =>
        service.serviceName === serviceName
          ? { ...service, price }
          : service
      ),
    }));
  };

  // Handle quantity changes
  const handleQtyChange = (serviceName, qty) => {
    setAdditionalServices((prevState) => ({
      ...prevState,
      data: prevState.data.map((service) =>
        service.serviceName === serviceName
          ? { ...service, qty }
          : service
      ),
    }));
  };


  useEffect(() => {
    console.log(additionalServices)
  }, [additionalServices])

  // check session user exists otherwise logout
  const getUserRecord = () => {
    HttpClient.get('po/get/' + props.userId)
      .then(responsePayload => {

      })
      .catch(error => {
        // in case of any error take the user to login page as this is unauthorized
        // navigate("/")
      })
  }

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
      <Form onSubmit={handleCreatePurchaseOrder}>
        <Row><Col><span style={{ font: "16px", fontWeight: 'bold' }}>User Info</span></Col></Row>
        <div className='gutter-20x' ></div>
        <Form.Group className="mb-3" controlId="fgFirstName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            value={formValues.name}
            onChange={(e) => handleInputChangeUser("name", e.target.value)}
            placeholder="Enter first name"
            style={{ fontSize: "16px" }}
          />
          {validationErrors.firstName && <p className="error-msg">{validationErrors.firstName}</p>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="fgEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            size="lg"
            type="email"
            value={formValues.email}
            onChange={(e) => handleInputChangeUser("email", e.target.value)}
            placeholder="Enter email"
            style={{ fontSize: "16px" }}
          />
          {validationErrors.email && <p className="error-msg">{validationErrors.email}</p>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="fgNtnNumber">
          <Form.Label>NTN Number</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            value={formValues.ntnNumber}
            onChange={(e) => handleInputChangeUser("ntnNumber", e.target.value)}
            placeholder="Enter NTN"
            style={{ fontSize: "16px" }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="fgAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            value={formValues.address}
            onChange={(e) => handleInputChangeUser("address", e.target.value)}
            placeholder="Enter Address"
            style={{ fontSize: "16px" }}
          />
        </Form.Group>

        {/* -----------------------------------------------------Elastic Cloud Server--------------------------------------------------------*/}

        <div className='gutter-40x' ></div>
        <div className='splitter' ></div>
        <div className="gutter-20x"></div>
        <Row><Col><span style={{ font: "16px", fontWeight: 'bold' }}>Elastic Cloud Server/ Virtual Machines</span></Col></Row>
        <div className='gutter-20x' ></div>
        <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
          <Col lg={2}>
            <span>Virtual Machine</span>
          </Col>
          <Col lg={1}>
            <span>vCPUs</span>
          </Col>
          <Col lg={1}>
            <span>RAM (GB)</span>
          </Col>
          <Col lg={1}>
            <span>Quantity</span>
          </Col>
          <Col lg={2}>
            <span>Monthly Per ECS (unit price)</span>
          </Col>
          <Col lg={2}>
            <span>Monthly Price</span>
          </Col>
        </Row>
        <div className='gutter-20x' ></div>
        {rows.map((row, index) => (
          <>
            <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
              <Col lg={2}>
                {/* <Form.Group className="mb-3" controlId={`fgServiceName-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    value={row.serviceName}
                    onChange={(e) => handleInputChange(index, "serviceName", e.target.value)}
                    placeholder="Service Name"
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group> */}
                {index + 1}
              </Col>
              <Col lg={1}>
                <Form.Group className="mb-3" controlId={`fgCPUs-${index}`}>
                  <Form.Select
                    aria-label=""
                    value={row.vCPUs}
                    onChange={(e) => handleInputChange(index, "vCPUs", e.target.value)}
                  >
                    <option value="0">0</option>
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
              <Col lg={1}>
                <Form.Group className="mb-3" controlId={`fgRAM-${index}`}>
                  <Form.Select
                    aria-label=""
                    value={row.ram}
                    onChange={(e) => handleInputChange(index, "ram", e.target.value)}
                  >
                    <option value="0">0</option>
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
              <Col lg={1}>
                <Form.Group className="mb-3" controlId={`fgQuantity-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    value={row.quantity}
                    onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                    placeholder="0"
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
                    onChange={(e) => {
                      handleInputChange(index, "rate", e.target.value)
                      handleInputChange(index, "monthlyPrice", (e.target.value * 730))
                    }}
                    placeholder="Set Rate"
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgRate-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    value={row.monthlyPrice}
                    // disabled={true}
                    onChange={(e) => handleInputChange(index, "monthlyPrice", e.target.value)}
                    placeholder="Monthly Rate"
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                {rows.length > 1 && (
                  <Button variant="danger" onClick={() => removeRow(index)}>
                    Remove
                  </Button>
                )}
              </Col>
            </Row>
            <div>
              {index === rows.length - 1 &&
                <Button
                  variant="outline-primary"
                  onClick={addRow}
                  style={{ marginRight: "5px" }}
                  disabled={index !== rows.length - 1}
                >
                  Add
                </Button>
              }
            </div>
          </>
        ))}


        {/* --------------------------------------------------------Storage Services---------------------------------------------------------*/}

        <div className='gutter-40x' ></div>
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
          <Col lg={1}>
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
          <>
            <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgService-${index}`}>
                  <Form.Select
                    aria-label="Select Service"
                    value={row.serviceName}
                    onChange={(e) => updateStorageService(index, "serviceName", e.target.value)}
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
                    {row.serviceName !== "" ?
                      <option>Select Type</option>
                      :
                      <option>Please First Select Service</option>
                    }
                    {row.serviceName === "elastic" &&
                      <>
                        <option value="SSD">General Purpose SSD (Per GB)</option>
                        <option value="HHD">HDD (Per GB)</option>
                      </>
                    }
                    {row.serviceName === "obs" && <option value="OBS">OBS for Object Data or IMS (Images)</option>}
                    {row.serviceName === "bv" && <option value="OBS-Licence">Licence + OBS</option>}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={1}>
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
                {storageService.length > 1 && (
                  <Button variant="danger" onClick={() => removeStorageServiceRow(index)}>
                    Remove
                  </Button>
                )}
              </Col>
            </Row>
            <div>
              {index === storageService.length - 1 && <Button
                variant="outline-primary"
                onClick={addStorageServiceRow}
                style={{ marginRight: "5px" }}
              >
                Add
              </Button>}
            </div>
          </>
        ))}

        {/* --------------------------------------------------------DR Services---------------------------------------------------------*/}

        <div className='gutter-40x' ></div>
        <div className='splitter' ></div>
        <div className="gutter-20x"></div>
        <Row><Col><span style={{ font: "16px", fontWeight: 'bold' }}>DR Services</span></Col></Row>
        <div className='gutter-20x' ></div>
        <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
          <Col lg={2}>
            <span>Service Name</span>
          </Col>
          <Col lg={2}>
            <span>Type</span>
          </Col>
          <Col lg={1}>
            <span>Qty </span>
          </Col>
          <Col lg={2}>
            <span>Duration (Hr / Month)</span>
          </Col>
          <Col lg={2}>
            Monthly Price
          </Col>
        </Row>
        <div className='gutter-20x' ></div>
        {drServices.map((row, index) => (
          <>
            <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgServiceName-${index}`}>
                  <Form.Select
                    aria-label="Select Service Name"
                    value={row.serviceName}
                    onChange={(e) => updateDrService(index, "serviceName", e.target.value)}
                  >
                    <option>Select Service Name</option>
                    <option value="csdr-licence">CSDR Licence (Without Resources)</option>
                    <option value="elastic-volume">Elastic Volume Services (Total)</option>
                    <option value="compute-resources">Compute Resources (Total)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgType-${index}`}>
                  <Form.Select
                    aria-label="Select Type"
                    value={row.type}
                    onChange={(e) => updateDrService(index, "type", e.target.value)}
                  >
                    <option>Select Type</option>
                    <option value="non-protected">No of Protected ECS</option>
                    <option value="g-purpose-ssd">General Purpose SSD (Per GB)</option>
                    <option value="g-purpose-hhd">General Purpose HHD (Per GB)</option>
                    <option value="vcpu">vCPU</option>
                    <option value="memory">Memory</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={1}>
                <Form.Group className="mb-3" controlId={`fgQuantity-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Qty"
                    value={row.quantity}
                    onChange={(e) => updateDrService(index, "quantity", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgDuration-${index}`}>
                  <Form.Control
                    value={row.duration}
                    onChange={(e) => updateDrService(index, "duration", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgMonthlyPrice-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Monthly Price"
                    value={row.monthlyPrice}
                    onChange={(e) => updateDrService(index, "monthlyPrice", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                {drServices.length > 1 && (
                  <Button variant="danger" onClick={() => removeDrServiceRow(index)}>
                    Remove
                  </Button>
                )}
              </Col>
            </Row>
            {
              index === drServices.length - 1 &&
              <Button
                variant="outline-primary"
                onClick={addDrServiceRow}
                style={{ marginRight: "5px" }}
                disabled={index !== drServices.length - 1}
              >
                Add
              </Button>
            }
          </>
        ))}

        {/* --------------------------------------------------------Container Services---------------------------------------------------------*/}


        <div className='gutter-40x' ></div>
        <div className='splitter' ></div>
        <div className="gutter-20x"></div>
        <Row><Col><span style={{ font: "16px", fontWeight: 'bold' }}>Container Services (CCE Cluster/ Management Platform)</span></Col></Row>
        <div className='gutter-20x' ></div>
        <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
          <Col lg={2}>
            <span>Service Name</span>
          </Col>
          <Col lg={2}>
            <span>Type</span>
          </Col>
          <Col lg={2}>
            <span>Qty Worker Node vCPUs </span>
          </Col>
          <Col lg={2}>
            <span>Duration (Hr / Month)</span>
          </Col>
          <Col>
            Monthly Price
          </Col>
        </Row>
        <div className='gutter-10x' ></div>
        {containerServices.map((row, index) => (
          <>
            <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgServiceName-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Service Name"
                    value={row.serviceName}
                    onChange={(e) => updateContainerService(index, "serviceName", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgDescription-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Description"
                    value={row.description}
                    onChange={(e) => updateContainerService(index, "description", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgVcpuQty-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Worker Node vCPU Qty"
                    value={row.vcpuQty}
                    onChange={(e) => updateContainerService(index, "vcpuQty", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgDuration-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Worker Node vCPU Qty"
                    value={row.duration}
                    onChange={(e) => updateContainerService(index, "duration", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                  {/* <Form.Select
                aria-label="Select Duration"
                value={row.duration}
                onChange={(e) => updateContainerService(index, "duration", e.target.value)}
              >
                <option>Select Duration</option>
                <option value="hourly">Hourly</option>
                <option value="monthly">Monthly</option>
              </Form.Select> */}
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgMonthlyPrice-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Monthly Price"
                    value={row.monthlyPrice}
                    onChange={(e) => updateContainerService(index, "monthlyPrice", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                {containerServices.length > 1 && (
                  <Button variant="danger" onClick={() => removeContainerServiceRow(index)}>
                    Remove
                  </Button>
                )}
              </Col>
            </Row>
            {(index === containerServices.length - 1) &&
              <Button
                variant="outline-primary"
                onClick={addContainerServiceRow}
                style={{ marginRight: "5px" }}
                disabled={index !== containerServices.length - 1}
              >
                Add
              </Button>
            }
          </>
        ))}

        {/* --------------------------------------------------------Container Services (Worker Nodes Details) ---------------------------------------------------------*/}

        <div className="gutter-40x"></div>
        <div className="splitter"></div>
        <div className="gutter-20x"></div>
        <Row>
          <Col>
            <span style={{ font: "16px", fontWeight: "bold" }}>
              Container Services (Worker Nodes Details - If not added above in ECS and Storage service)
            </span>
          </Col>
        </Row>
        <div className="gutter-20x"></div>
        <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
          <Col lg={2}>
            <span>Service Name</span>
          </Col>
          <Col lg={2}>
            <span>Description</span>
          </Col>
          <Col lg={2}>
            <span>Worker Node vCPU Qty</span>
          </Col>
          <Col lg={2}>
            <span>Duration (Hr / Month)</span>
          </Col>
          <Col>Monthly Price</Col>
        </Row>
        <div className="gutter-10x"></div>
        {containerSpecialServices.map((row, index) => (
          <>
            <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgServiceName-${index}`}>
                  <Form.Select
                    aria-label="Select Service Name"
                    value={row.serviceName}
                    onChange={(e) => updateContainerSpecialService(index, "serviceName", e.target.value)}
                  >
                    <option>Select Service Name</option>
                    <option value="evs">Elastic Volume Services (Total)</option>
                    <option value="total-worker-nodes">Compute Resources for Worker Nodes (Total)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgDescription-${index}`}>
                  <Form.Select
                    aria-label="Select Service"
                    value={row.description}
                    onChange={(e) => updateContainerSpecialService(index, "description", e.target.value)}
                  >
                    <option>Select</option>
                    {
                      row.serviceName === "evs" &&
                      <>
                        <option value="ssd-per-gb">General Purpose SSD (Per GB)</option>
                        <option value="hdd-per-gb">HDD (Per GB)</option>
                      </>
                    }
                    {
                      row.serviceName === "total-worker-nodes" &&
                      <>
                        <option value="ssd-per-gb">vCPUs</option>
                        <option value="hdd-per-gb">Memory</option>
                      </>
                    }
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgVcpuQty-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Worker Node vCPU Qty"
                    value={row.vcpuQty}
                    onChange={(e) => updateContainerSpecialService(index, "vcpuQty", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgDuration-${index}`}>
                  <Form.Control
                    value={row.duration}
                    onChange={(e) => updateContainerSpecialService(index, "duration", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgMonthlyPrice-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Monthly Price"
                    value={row.monthlyPrice}
                    onChange={(e) => updateContainerSpecialService(index, "monthlyPrice", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                {containerSpecialServices.length > 1 && (
                  <Button variant="danger" onClick={() => removeContainerSpecialServiceRow(index)}>
                    Remove
                  </Button>
                )}
              </Col>
            </Row>
            {(index === containerSpecialServices.length - 1) && <Button
              variant="outline-primary"
              onClick={addContainerSpecialServiceRow}
              style={{ marginRight: "5px" }}
              disabled={index !== containerSpecialServices.length - 1}
            >
              Add
            </Button>}
          </>
        ))}

        {/* -------------------------------------------------------- Security and Protection Services ---------------------------------------------------------*/}

        <div className='gutter-40x' ></div>
        <div className='splitter' ></div>
        <div className="gutter-20x"></div>
        <Row><Col><span style={{ font: "16px", fontWeight: 'bold' }}>Security and Protection Services</span></Col></Row>
        <div className='gutter-20x' ></div>
        <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
          <Col lg={2}>
            <span>Service Name</span>
          </Col>
          <Col lg={2}>
            <span>Type</span>
          </Col>
          <Col lg={2}>
            <span>Qty </span>
          </Col>
          <Col lg={2}>
            <span>Duration (Hr / Month)</span>
          </Col>
          <Col>
            Monthly Price
          </Col>
        </Row>
        <div className='gutter-20x'></div>
        {securityServices.map((row, index) => (
          <>
            <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgServiceName-${index}`}>
                  <Form.Select
                    aria-label="Select Service Name"
                    value={row.serviceName}
                    onChange={(e) => updateSecurityService(index, "serviceName", e.target.value)}
                  >
                    <option>Select Service Name</option>
                    <option value="hss">Host Security Service - HSS</option>
                    <option value="waf">WAF</option>
                    <option value="edge-fw">Edge FW</option>
                    <option value="cloud-fw">Cloud FW</option>
                    <option value="hsm-kms">HSM / KMS (Per Key)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgType-${index}`}>
                  <Form.Select
                    aria-label="Select Type"
                    value={row.type}
                    onChange={(e) => updateSecurityService(index, "type", e.target.value)}
                  >
                    <option>Select Type</option>
                    {row.serviceName === "hss" && <option value="host-ecs-security">Host Security Service - Per ECS Licence</option>}
                    {row.serviceName === "waf" && <option value="waf">Web Application Firewall (Per 100 Mbps)</option>}
                    {row.serviceName === "edge-fw" && <option value="efe-protection">Edge Firewall External Protection from Edge based on vCPU of protected ECS</option>}
                    {row.serviceName === "cloud-fw" && <option value="cfe-protection">Cloud Firewall for internal Protection based on vCPU of protected ECS</option>}
                    {row.serviceName === "hsm-kms" && <option value="kms-protection">KMS Encryption (Per Key)</option>}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgDescription-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Description"
                    value={row.description}
                    onChange={(e) => updateSecurityService(index, "description", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgDuration-${index}`}>
                  <Form.Control
                    aria-label="Select Duration"
                    value={row.duration}
                    onChange={(e) => updateSecurityService(index, "duration", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgMonthlyPrice-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Monthly Price"
                    value={row.monthlyPrice}
                    onChange={(e) => updateSecurityService(index, "monthlyPrice", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                {securityServices.length > 1 && (
                  <Button variant="danger" onClick={() => removeSecurityServiceRow(index)}>
                    Remove
                  </Button>
                )}
              </Col>
            </Row>
            {(index === securityServices.length - 1) && <Button
              variant="outline-primary"
              onClick={addSecurityServiceRow}
              style={{ marginRight: "5px" }}

            >
              Add
            </Button>
            }
          </>
        ))}

        {/* -------------------------------------------------------- Database Services ---------------------------------------------------------*/}

        <div className="gutter-40x"></div>
        <div className="splitter"></div>
        <div className="gutter-20x"></div>
        <Row>
          <Col>
            <span style={{ font: "16px", fontWeight: "bold" }}>Database as a Service</span>
          </Col>
        </Row>
        <div className="gutter-20x"></div>
        <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
          <Col lg={2}>
            <span>Service Name</span>
          </Col>
          <Col lg={2}>
            <span>Type</span>
          </Col>
          <Col lg={2}>
            <span>Qty</span>
          </Col>
          <Col lg={2}>
            <span>Duration (Hr / Month)</span>
          </Col>
          <Col>Monthly Price</Col>
        </Row>
        <div className="gutter-10x"></div>
        {databaseServices.map((row, index) => (
          <>
            <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgServiceName-${index}`}>
                  <Form.Select
                    aria-label="Select Service Name"
                    value={row.serviceName}
                    onChange={(e) => updateDatabaseService(index, "serviceName", e.target.value)}
                  >
                    <option>Select Service Name</option>
                    <option value="das">Database as a Service (per vCPU Licence)</option>

                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgType-${index}`}>
                  <Form.Select
                    aria-label="Select Type"
                    value={row.type}
                    onChange={(e) => updateDatabaseService(index, "type", e.target.value)}
                  >
                    <option>Select Type</option>
                    <option value="das-service">MySQL, Mongo DB, Redis etc</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgQty-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Qty"
                    value={row.qty}
                    onChange={(e) => updateDatabaseService(index, "qty", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgDuration-${index}`}>
                  <Form.Control
                    aria-label="Select Duration"
                    value={row.duration}
                    onChange={(e) => updateDatabaseService(index, "duration", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgMonthlyPrice-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Monthly Price"
                    value={row.monthlyPrice}
                    onChange={(e) => updateDatabaseService(index, "monthlyPrice", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                {databaseServices.length > 1 && (
                  <Button variant="danger" onClick={() => removeDatabaseServiceRow(index)}>
                    Remove
                  </Button>
                )}
              </Col>
            </Row>
            {index === databaseServices.length - 1 && <Button
              variant="outline-primary"
              onClick={addDatabaseServiceRow}
              style={{ marginRight: "5px" }}
            >
              Add
            </Button>}
          </>
        ))}

        {/* -------------------------------------------------------- Network Services ---------------------------------------------------------*/}

        <div className="gutter-40x"></div>
        <div className="splitter"></div>
        <div className="gutter-20x"></div>
        <Row>
          <Col>
            <span style={{ font: "16px", fontWeight: "bold" }}>Network Services</span>
          </Col>
        </Row>
        <div className="gutter-20x"></div>
        <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
          <Col lg={2}>
            <span>Service Name</span>
          </Col>
          <Col lg={2}>
            <span>Type</span>
          </Col>
          <Col lg={2}>
            <span>Qty</span>
          </Col>
          <Col lg={2}>
            <span>Duration (Hr / Month)</span>
          </Col>
          <Col>Monthly Price</Col>
        </Row>
        <div className="gutter-10x"></div>
        {networkServices.map((row, index) => (
          <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgServiceName-${index}`}>
                <Form.Select
                  aria-label="Select Service Name"
                  value={row.serviceName}
                  onChange={(e) => updateNetworkService(index, "serviceName", e.target.value)}
                >
                  <option>Select Service Name</option>
                  <option value="eip">EIP - Per EIP</option>
                  <option value="banwidth">Bandwith - Per MB</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgType-${index}`}>
                <Form.Select
                  aria-label="Select Type"
                  value={row.type}
                  onChange={(e) => updateNetworkService(index, "type", e.target.value)}
                >
                  <option>Select Type</option>
                  {row.serviceName === "eip" && <option value="public-static-ip">Elastic (Public static) IP</option>}
                  {row.serviceName === "banwidth" && <option value="bandwidth">Cloud bandwidth for ELB, VPN, ECS, EIP etc</option>}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgQty-${index}`}>
                <Form.Control
                  size="lg"
                  type="text"
                  placeholder="Qty"
                  value={row.qty}
                  onChange={(e) => updateNetworkService(index, "qty", e.target.value)}
                  style={{ fontSize: "16px" }}
                />
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgDuration-${index}`}>
                <Form.Control
                  value={row.duration}
                  onChange={(e) => updateNetworkService(index, "duration", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgMonthlyPrice-${index}`}>
                <Form.Control
                  size="lg"
                  type="text"
                  placeholder="Monthly Price"
                  value={row.monthlyPrice}
                  onChange={(e) => updateNetworkService(index, "monthlyPrice", e.target.value)}
                  style={{ fontSize: "16px" }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Button
                variant="outline-primary"
                onClick={addNetworkServiceRow}
                style={{ marginRight: "5px" }}
                disabled={index !== networkServices.length - 1}
              >
                Add
              </Button>
              {networkServices.length > 1 && (
                <Button variant="danger" onClick={() => removeNetworkServiceRow(index)}>
                  Remove
                </Button>
              )}
            </Col>
          </Row>
        ))}
        <div className="gutter-10x"></div>
        <div className="splitter"></div>
        <div className="gutter-20x"></div>
        <Row>
          <Col>
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>
              Value Added (Free Services)
            </span>
          </Col>
        </Row>
        <div className="gutter-20x"></div>
        <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
          {/* Column 1 */}
          <Col lg={6}>
            {[
              "elasticLoadBalancer",
              "natSet",
              "smnSet",
              "autoScaling",
              "vpn",
            ].map((service) => (
              <div key={service} style={{ marginBottom: "10px" }}>
                <Row>
                  <Col>
                    <Form.Check
                      type="checkbox"
                      label={service
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^\w/, (c) => c.toUpperCase())}
                      checked={additionalServices.data.some((s) => s.serviceName === service)}
                      onChange={() => handleCheckboxChange(service)}
                    />
                  </Col>
                  {additionalServices.data.some((s) => s.serviceName === service) && (
                    <>
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Enter Price"
                          value={
                            additionalServices.data.find((s) => s.serviceName === service)?.price || ""
                          }
                          onChange={(e) => handlePriceChange(service, e.target.value)}
                          style={{ marginTop: "5px", fontSize: "14px", float: "right" }}
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Enter Qty"
                          value={
                            additionalServices.data.find((s) => s.serviceName === service)?.qty || ""
                          }
                          onChange={(e) => handleQtyChange(service, e.target.value)}
                          style={{ marginTop: "5px", fontSize: "14px", float: "right" }}
                        />
                      </Col>
                    </>
                  )}
                </Row>
              </div>
            ))}
          </Col>
          {/* Column 2 */}
          <Col lg={6}>
            {[
              "imageManagementService",
              "virtualPrivateCloud",
              "dns",
              "monitoringService",
              "securityGroups",
              "accessControlList",
            ].map((service) => (
              <div key={service} style={{ marginBottom: "10px" }}>
                <Form.Check
                  type="checkbox"
                  label={service
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^\w/, (c) => c.toUpperCase())}
                  checked={additionalServices.data.some((s) => s.serviceName === service)}
                  onChange={() => handleCheckboxChange(service)}
                />
                {additionalServices.data.some((s) => s.serviceName === service) && (
                  <>
                    <Form.Control
                      type="text"
                      placeholder="Enter Price"
                      value={
                        additionalServices.data.find((s) => s.serviceName === service)?.price || ""
                      }
                      onChange={(e) => handlePriceChange(service, e.target.value)}
                      style={{ marginTop: "5px", fontSize: "14px" }}
                    />
                    <Form.Control
                      type="text"
                      placeholder="Enter Qty"
                      value={
                        additionalServices.data.find((s) => s.serviceName === service)?.qty || ""
                      }
                      onChange={(e) => handleQtyChange(service, e.target.value)}
                      style={{ marginTop: "5px", fontSize: "14px" }}
                    />
                  </>
                )}
              </div>
            ))}
          </Col>
        </Row>
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
