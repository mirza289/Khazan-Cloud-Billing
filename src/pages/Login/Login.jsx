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
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
//
import HttpClient from '../../api/HttpClient'
import AppHeader from '../../components/AppHeader'
//
const showPassword = <i className="las la-eye" style={{ cursor: 'pointer' }}></i>;
const hidePassword = <i className="las la-eye-slash" style={{ cursor: 'pointer' }}></i>;

const Login = () => {
  const firstRender = useRef(true)
  const passwordRef = useRef(null)
  const navigate = useNavigate()
  //
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [spinner, showSpinner] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [passwordShown, setPasswordShown] = useState(false)
  const [apiError, setApiError] = useState('')

  const [rememberMe, setRememberMe] = useState(false);


  useEffect(() => {
    // Skip the validation on first render
    if (firstRender.current) {
      firstRender.current = false
      return
    }
  }, [])

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

    navigate("/settings/resource-usage")

    // // continue if no validation errors
    // let formData = new FormData()
    // formData.append('email', email)
    // formData.append('password', password)
    // formData.append('remember_me', rememberMe)

    // HttpClient.post('auth/login', formData)
    //   .then(responsePayload => {
    //     showSpinner(false)
    //     navigate("/settings/home")
    //   })
    //   .catch(error => {
    //     showSpinner(false)
    //     if (error.response) {
    //       setApiError(error.response.data.message)
    //     } else if (error.request) {
    //       setApiError(error.request)
    //     } else {
    //       setApiError(error.message)
    //     }

    //     // reset the password on any error
    //     setPassword('')
    //     passwordRef.current.value = ''
    //   })
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
      {/* <Row style={{ backgroundColor: "#E9F5FE" }}>
        <Col style={{ paddingLeft: "20px" }}>
          <div className="gutter-10x"></div>
          <div style={{ paddingBottom: 10 }}>
            <img
              style={{
                float: 'left',
                width: '30px',
                height: "40px"
              }}
              src={require("../../assets/images/cloud-logo.png")}
              alt="Logo" />
            <span style={{ float: 'left', padding: 10, fontWeight: '400' }}> Khazana Cloud</span>
          </div>
          <div className="gutter-10x"></div>
          <div className="gutter-5x"></div>
        </Col>
      </Row> */}
      <AppHeader sourceType={"login"} />
      <Row>
        <Col lg="4"></Col>
        <Col lg="4" style={{
          paddingTop: "80px",
          paddingLeft: "20px",
          paddingRight: "20px",
          textAlign: "center"
        }}>
          <div>
            <h1 style={{ fontWeight: "800" }}>Login</h1>
            <div className="gutter-20x"></div>
            <div>
              Login to your account
            </div>
            <div className="gutter-20x"></div>
            <div className="gutter-20x"></div>
            {
              apiError &&
              <Alert className="form-global-error">{apiError}</Alert>
            }
            <div className="gutter-10x"></div>
            <div style={{ textAlign: "left" }}>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="loginEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    size="lg"
                    type="email"
                    placeholder="Email"
                    onChange={e => setEmail(e.target.value)}
                    style={{ fontSize: "16px" }} />
                  {
                    validationErrors.email &&
                    <p className="error-msg">{validationErrors.email}</p>
                  }
                </Form.Group>
                <Form.Group className="mb-3" controlId="loginPassword">
                  <Row>
                    <Col><Form.Label>Password</Form.Label></Col>
                    <Col style={{ textAlign: "right" }}></Col>
                  </Row>

                  <InputGroup className='passwordGroup'>
                    <Form.Control
                      size="lg"
                      ref={passwordRef}
                      type={passwordShown ? "text" : "password"}
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
                <div className="gutter-40x"></div>
                <div className="d-grid gap-2">
                  <Button
                    size="lg"
                    type="submit"
                    style={{ fontSize: "16px", borderRadius: "20px", backgroundColor: "#2887d4" }}>
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
              <div className="gutter-20x"></div>
              <div>
                Do not have an account? <Link to="https://Khazana.com/contact/" style={{ textDecoration: "none", color: "#212529" }}>Contact Us</Link>
              </div>
            </div>
          </div>
        </Col>
        <Col lg="4"></Col>
      </Row>
    </Container>
  )
}
export default Login