import React, { useState, useEffect, useRef } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import InputGroup from 'react-bootstrap/InputGroup'
import Alert from 'react-bootstrap/Alert'
//
import { useNavigate, useParams } from 'react-router-dom'
//
import HttpClient from '../../api/HttpClient'
//
const showPassword = <i className="las la-eye" style={{ cursor: 'pointer' }}></i>;
const hidePassword = <i className="las la-eye-slash" style={{ cursor: 'pointer' }}></i>;

const Auth = () => {
  const firstRender = useRef(true)
  const passwordRef = useRef(null)
  const navigate = useNavigate()
  const { url_email } = useParams()
  const urlParams = new URLSearchParams(window.location.search)
  const redirectUrl = urlParams.get("redirectUrl")

  //
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [spinner, showSpinner] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [passwordShown, setPasswordShown] = useState(false)
  const [apiError, setApiError] = useState('')
  const [rememberMe, setRememberMe] = useState(false);
  const [authSpinner, setAuthSpinner] = useState(false)

  useEffect(() => {
    // Skip the validation on first render
    if (firstRender.current) {
      firstRender.current = false
      return
    }
  }, [])

  useEffect(() => {
    document.title = ("Auth | Khazana")
    checkUserSession()
  }, [])

 // check session user exists otherwise logout
 const checkUserSession = () => {
  setAuthSpinner(true)
   HttpClient.get('auth/me')
     .then(responsePayload => {
      setAuthSpinner(false)

      if (redirectUrl === "profile") {
        navigate("/settings/user-profile")
      }
      else {
        navigate("/settings/home")
      }
     })
     .catch(error => {
      // if there is no session then force the user to do authentication
      setAuthSpinner(false)
      const decodedEmail = atob(url_email)
      setEmail(decodedEmail)
     })
 }

  const handleLogin = (e) => {
    e.preventDefault()
    showSpinner(true)
    setApiError('')
    setValidationErrors({})

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
    formData.append('email', email)
    formData.append('password', password)
    formData.append('remember_me', rememberMe)

    HttpClient.post('auth/login', formData)
      .then(responsePayload => {
        showSpinner(false)
        if (redirectUrl === "profile") {
          navigate("/settings/user-profile")
        }
        else {
          navigate("/settings/home")
        }
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

    return validationErrors
  }

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  }

  return (
    <Container fluid>
      <Row style={{ backgroundColor: "#E9F5FE" }}>
        <Col style={{ paddingLeft: "20px" }}>
          <div className="gutter-10x"></div>
          <div className="gutter-5x"></div>
          <img 
            src={require("../../assets/images/logo.png")}
            alt="Logo" />
          <div className="gutter-10x"></div>
          <div className="gutter-5x"></div>
        </Col>
      </Row>
      <Row>
        <Col lg="4"></Col>
        <Col lg="4" style={{ paddingTop: "80px",
                      paddingLeft: "20px", 
                      paddingRight: "20px", 
                      textAlign: "center" }}>
          <div>
          {
            !authSpinner ? (
              <>
                <div>
                  Please enter password to go to settings
                </div>
                <div className="gutter-20x"></div>
                <div className="gutter-10x"></div>
                <div style={{ textAlign: "left"}}>
                {
                    apiError &&
                    <>
                    <div className="gutter-10x"></div>
                    <Alert className="form-global-error">{apiError}</Alert>
                    <div className="gutter-10x"></div>
                    </>
                }
                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3" controlId="loginEmail">
                      <Form.Label>Email</Form.Label>
                      <div>{ email }</div>
                    </Form.Group> 
                    <Form.Group className="mb-3" controlId="loginPassword">
                      <Row>
                        <Col><Form.Label>Password</Form.Label></Col>
                      </Row>
                      
                      <InputGroup className='passwordGroup'>
                        <Form.Control 
                          size="lg" 
                          ref={ passwordRef }
                          type={ passwordShown ? "text" : "password" } 
                          placeholder="Password" 
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
                    </Form.Group> 
                    <label>
                      <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                      />
                      <span style={{ paddingLeft: "10px", fontSize: "14px" }}>Remember me</span>
                    </label>
                    <div className="gutter-20x"></div>
                    <div className="d-grid gap-2">
                      <Button 
                        size="lg" 
                        type="submit" 
                        style={{ fontSize: "16px",borderRadius: "20px", backgroundColor: "#2887d4" }}>
                        {
                          spinner ?
                            <div>
                              <Spinner style={{ marginRight: 10, marginTop: 5 }} animation="border" size="sm" variant="light" role="status" />
                              Logging in ...
                            </div>
                          :
                          <div>Login</div>
                        }
                      </Button>
                    </div>
                  </Form>
                </div>
              </>
            ) : (
              <div>
                <Spinner style={{ marginRight: 10, marginTop: 5 }} animation="border" size="sm" variant="dark" role="status" />
                Authenticating...
              </div>
            )
          }
          </div>
        </Col>
        <Col lg="4"></Col>
      </Row>
    </Container>
  )
}
export default Auth