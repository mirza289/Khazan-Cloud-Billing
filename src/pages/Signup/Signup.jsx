import React, { useState, useEffect, useRef } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import InputGroup from 'react-bootstrap/InputGroup'
import { useNavigate } from 'react-router-dom'
//
import Gravatar from 'react-gravatar'
import {Link} from 'react-router-dom'
//
import HttpClient from '../../api/HttpClient'
//
const showPassword = <i className="las la-eye" style={{ cursor: "pointer" }}></i>
const hidePassword = <i className="las la-eye-slash" style={{ cursor: "pointer" }}></i>


const Signup = () => {
  const firstRender = useRef(true)
  const passwordRef = useRef(null)
  const navigate = useNavigate()
  //
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [spinner, showSpinner] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [passwordShown, setPasswordShown] = useState(false)
  const [apiError, setApiError] = useState('')
  const [isTermsChecked, setIsTermsChecked] = useState(false)

  // password policy 
  const [passLength, setLength] = useState(false)
  const [upperCase, setUpperCase] = useState(false)
  const [lowerCase, setLowerCase] = useState(false)
  const [numbers, setNumbers] = useState(false)
  const [nonAlphabet, setNonAlphabet] = useState(false)

  useEffect(() => {
    // Skip the validation on first render
    if (firstRender.current) {
      firstRender.current = false
      return
    }
  }, [])

  const handleTermsCheckboxChange = () => {
    setIsTermsChecked(!isTermsChecked)
  }

  // handle signup
  const handleSignup = (e) => {
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
    formData.append('full_name', fullName)
    formData.append('email', email)
    formData.append('password', password)

    HttpClient.post('signup/signup', formData)
      .then(responsePayload => {
        showSpinner(false)
          navigate("/home")
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

  // utilities functions
  const formValidation = () => {
    const validationErrors = {}

    // validate full name
    if (fullName.length === 0) {
      validationErrors.fullName = 'Full name is required'
    }
    else if (fullName.length > 100) {
      validationErrors.fullName = 'Full Name is too long (maximum is 100 characters)'
    }
    else if (!/^[a-zA-Z" " ]+$/.test(fullName)) {
      validationErrors.fullName = 'Full name must be letters only'
    }

    // validate email
    if (email.length === 0) {
      validationErrors.email = 'Email address is required'
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      validationErrors.email = 'Email address is invalid'
    }

    // validate password
    if (password.length === 0) {
      validationErrors.password = 'password is required'
    }
    else if (password.length > 20) {
      validationErrors.password = 'password should be between 8-20 characters'
    }
    else if (password.length < 8) {
      validationErrors.password = 'password should be between 8-20 characters'
    }
    else if (!/^(?=.*[A-Z])/.test(password)) {
      validationErrors.password = 'password should contain 1 uppercase'
    }
    else if (!/^(?=.*[a-z])/.test(password)) {
      validationErrors.password = 'password should contain 1 lowercase'
    }
    else if (!/^(?=.*[0-9])/.test(password)) {
      validationErrors.password = 'password should contain 1 number'
    }
    else if (!/([^A-Za-z0-9])/.test(password)) {
      validationErrors.password = 'password should contain 1 special character'
    }

    return validationErrors
  }

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  }

  return (
    <Container>
      <Row>
        {/* Signup AI wizard */}
        <Col lg="7" style={{ paddingRight: "40px" }}>
          <div className="gutter-40x"></div>
          <div>
              <img 
                src={require("../../assets/images/logo.png")}
                alt="Logo" />
                <span style={{ fontWeight: "bold", paddingLeft: "20px" }}>Tag line</span>              
            </div>
            <div className="gutter-40x"></div>

            <h1>Add background color or image in this panel</h1>
        </Col>

        {/* Signup user input */}
        <Col lg="5" style={{ paddingTop: "40px",
                              paddingLeft: "20px", 
                              paddingRight: "20px", 
                              textAlign: "center" }}>
          <div>
            <h1 style={{ fontWeight: "800" }}>Sign Up</h1>
            <div className="gutter-20x"></div>
            <div>
              <h4>Create your account</h4>
            </div>
            <div>
              Tag line
            </div>
            <div className="gutter-20x"></div>
            {
              apiError && 
                <Alert className="form-global-error">{apiError}</Alert>
            }
            <div className="gutter-10x"></div>
            <div style={{ textAlign: "left"}}>
              <Form onSubmit={handleSignup}>
                <Form.Group className="mb-3" controlId="signupFullname">
                  <Form.Label>Full name</Form.Label>
                  <Form.Control 
                    size="lg" 
                    type="text" 
                    autoFocus={true}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Enter full name" 
                    style={{ fontSize: "16px" }} />
                  {
                    validationErrors.fullName && 
                      <p className="error-msg">{validationErrors.fullName}</p>
                  }
                </Form.Group> 
                <Form.Group className="mb-3" controlId="signupEmail">
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
                <Form.Group className="mb-3" controlId="signupPassword">
                  <Form.Label>Password</Form.Label>
                  <InputGroup className='passwordGroup'>
                  <Form.Control 
                    size="lg" 
                    ref={ passwordRef }
                    type={ passwordShown ? "text" : "password" }
                    placeholder="Create your password" 
                    onChange={e => setPassword(e.target.value)}
                    style={{ fontSize: "16px" }} />
                    <InputGroup.Text>
                      {
                        passwordShown ?
                          <i onClick={togglePasswordVisiblity} className="showPwd-iconfloat-right">{showPassword}</i>
                          :
                          <i onClick={togglePasswordVisiblity} className="showPwd-iconfloat-right">{hidePassword}</i>
                      }
                    </InputGroup.Text>
                  </InputGroup>
                  {
                    validationErrors.password && 
                      <p className="error-msg">{validationErrors.password}</p>
                  }
                  <Form.Text id="passwordHelpBlock" muted>
                    Your password must be 8-20 characters long, must container 1 uppercase, 1 lowercase,
                    1 number, and 1 special character
                  </Form.Text>
                </Form.Group> 
                <div className="gutter-40x"></div>
                <Form.Check // prettier-ignore
                  type="checkbox"
                  id="termsCheck"
                  checked={isTermsChecked}
                  onChange={handleTermsCheckboxChange}
                  label="I agree with terms and privacy policy"
                />
                <div className="gutter-40x"></div>
                <div className="d-grid gap-2">
                  <Button 
                    variant="dark" 
                    size="lg" 
                    type="submit" 
                    disabled={!isTermsChecked}
                    style={{ fontSize: "16px" }}>
                    {
                      spinner ?
                        <div>
                          <Spinner style={{ marginRight: 10, marginTop: 5 }} animation="border" size="sm" variant="light" role="status" />
                          Signing Up ...
                        </div>
                      :
                      <div>Signup</div>
                    }
                  </Button>
                </div>
              </Form>
              <div className="gutter-20x"></div>
              <div>
                Already have an account? <Link to="/" style={{ textDecoration: "none", color: "#212529"  }}>Login</Link>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Signup