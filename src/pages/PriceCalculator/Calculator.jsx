import React, { useState, useRef, useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Alert from 'react-bootstrap/Alert'
import { useNavigate } from 'react-router-dom'
//
import HttpClient from '../../api/HttpClient'
import { toast } from 'react-toastify'
import ElasticService from '../Settings/components/Services/ElasticService'
import StorageService from '../Settings/components/Services/StorageService'
import DrService from '../Settings/components/Services/DrService'
import ContainerService from '../Settings/components/Services/ContainerService'
import ContainerServiceWK from '../Settings/components/Services/ContainerServiceWK'
import SecurityService from '../Settings/components/Services/SecurityService'
import DatabaseService from '../Settings/components/Services/DatabaseService'
import NetworkService from '../Settings/components/Services/NetworkService'
import ValueAddedService from '../Settings/components/Services/ValueAddedService'
//
const showPassword = <i className="las la-eye" style={{ cursor: "pointer" }}></i>
const hidePassword = <i className="las la-eye-slash" style={{ cursor: "pointer" }}></i>

const Calculator = (props) => {
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


    useEffect(() => {
        // Fetch data from local storage
        const storedData = JSON.parse(localStorage.getItem("unitCost"));
        console.log(`Data fetched: ${JSON.stringify(storedData)}`)
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
            'data': elasticServices
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

    const [elasticServices, setElasticServices] = useState([]);

    // Handle input changes for a specific row
    const handleInputChange = (index, field, value) => {
        const updatedRows = [...elasticServices];
        updatedRows[index][field] = value;
        setElasticServices(updatedRows);
    };

    // Add a new row
    const addRow = () => {
        setElasticServices([
            ...elasticServices,
            { vCPUs: 0, ram: 0, quantity: 0, rate: 0, monthlyPrice: 0 },
        ]);
    };

    // Remove a row
    const removeRow = (index) => {
        const updatedRows = elasticServices.filter((_, i) => i !== index);
        setElasticServices(updatedRows);
    };

    //// handle storage states 

    // State to manage elasticServices, renamed to storageService
    const [storageService, setStorageService] = useState([]);


    //// DR Services 


    // State to manage DR services
    const [drServices, setDrServices] = useState([]);

    // State to manage Container Services
    const [containerServices, setContainerServices] = useState([]);


    const [containerSpecialServices, setContainerSpecialServices] = useState([]);

    //////////////////////////////////////////////////////////////////////////////
    // State to manage Security and Protection Services
    const [securityServices, setSecurityServices] = useState([]);


    ///  database 
    const [databaseServices, setDatabaseServices] = useState([]);

    /// network Services 

    const [networkServices, setNetworkServices] = useState([]);

    /// value edit fields 
    const [additionalServices, setAdditionalServices] = useState({
        serviceName: "additionalServices",
        data: [], // Array to hold selected services with price and qty
    });


    useEffect(() => {
        console.log(additionalServices)
    }, [additionalServices])

    /// fetch the user data 
    const getUserRecord = () => {
        HttpClient.get('po/get/' + props.userId)
            .then(responsePayload => {
                let response = responsePayload.data.data
                setFormValues(response["user-info"])

                for (let index = 0; index < response.services.length; index++) {
                    if (response.services[index].serviceName === 'elasticService')
                        setElasticServices(response.services[index].data)
                    if (response.services[index].serviceName === 'storageService')
                        setStorageService(response.services[index].data)
                    if (response.services[index].serviceName === 'drService')
                        setDrServices(response.services[index].data)
                    if (response.services[index].serviceName === 'containerServices')
                        setContainerServices(response.services[index].data)
                    if (response.services[index].serviceName === 'containerServiceWorker')
                        setContainerSpecialServices(response.services[index].data)
                    if (response.services[index].serviceName === 'securityServices')
                        setSecurityServices(response.services[index].data)
                    if (response.services[index].serviceName === 'databaseServices')
                        setDatabaseServices(response.services[index].data)
                    if (response.services[index].serviceName === 'networkServices')
                        setNetworkServices(response.services[index].data)
                }
            })
            .catch(error => {
                // in case of any error take the user to login page as this is unauthorized
                // navigate("/")
            })
    }

    return (
        <Container style={{ paddingRight: "0", paddingLeft: "0" }}>
            {
                apiError &&
                <>
                    <div className="gutter-10x"></div>
                    <Alert className="form-global-error">{apiError}</Alert>
                    <div className="gutter-10x"></div>
                </>
            }
            <div className="gutter-40x"></div>
            <Form onSubmit={handleCreatePurchaseOrder}>

                {/* -----------------------------------------------------Elastic Cloud Server--------------------------------------------------------*/}

                <ElasticService
                    elasticServices={elasticServices}
                    setElasticServices={setElasticServices}
                />

                {/* --------------------------------------------------------Storage Services---------------------------------------------------------*/}

                <StorageService
                    storageService={storageService}
                    setStorageService={setStorageService}
                />
                {/* --------------------------------------------------------DR Services---------------------------------------------------------*/}

                <DrService
                    drServices={drServices}
                    setDrServices={setDrServices}
                />

                {/* --------------------------------------------------------Container Services---------------------------------------------------------*/}


                <ContainerService
                    containerServices={containerServices}
                    setContainerServices={setContainerServices}
                />


                {/* --------------------------------------------------------Container Services (Worker Nodes Details) ---------------------------------------------------------*/}

                <ContainerServiceWK
                    containerSpecialServices={containerSpecialServices}
                    setContainerSpecialServices={setContainerSpecialServices}
                />

                {/* -------------------------------------------------------- Security and Protection Services ---------------------------------------------------------*/}

                <SecurityService
                    securityServices={securityServices}
                    setSecurityServices={setSecurityServices}
                />

                {/* -------------------------------------------------------- Database Services ---------------------------------------------------------*/}
                <DatabaseService
                    databaseServices={databaseServices}
                    setDatabaseServices={setDatabaseServices}
                />
                {/* -------------------------------------------------------- Network Services ---------------------------------------------------------*/}

                <NetworkService
                    networkServices={networkServices}
                    setNetworkServices={setNetworkServices}
                />

                {/* -------------------------------------------------------- Value Added Services ---------------------------------------------------------*/}

                <ValueAddedService
                    additionalServices={additionalServices}
                    setAdditionalServices={setAdditionalServices}
                />


            </Form>
        </Container>
    )
}

export default Calculator
