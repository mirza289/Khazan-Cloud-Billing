import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
//
import {Link} from 'react-router-dom'
import Gravatar from 'react-gravatar'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { useNavigate } from 'react-router-dom'
//
import HttpClient from '../../api/HttpClient'
import AppHeader from '../../components/AppHeader'
import SidebarMenu from '../../components/SidebarMenu'

const Home = () => {
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)
  const [sessionUser, setSessionUser] = useState({})
  const [apiError, setApiError] = useState('')

  useEffect(() => {
  // checkUserSession()
  }, [])

  // check session user exists otherwise logout
  const checkUserSession = () => {
    HttpClient.get('auth/me')
      .then(responsePayload => {
        // set the user object from the session
        setSessionUser(responsePayload.data.data)
      })
      .catch(error => {
        // in case of any error take the user to login page as this is unauthorized
        navigate("/")
      })
  }

  // handle logout functionality
  function handleLogout() {
    // HttpClient.get('auth/logout')
    //   .then(responsePayload => {
    //     navigate("/")
    //   })
    //   .catch(error => {
    //     // in case of any error take the user to login page as this is unauthorized
    //     navigate("/")
    //   })
  }

  return (
    <Container fluid style={{ paddingRight: "0", paddingLeft: "0"}}>
      <AppHeader />
      <div style={{ display: "flex", height: "98vh" }}>
        <SidebarMenu />
        {/* <Sidebar collapsed={collapsed}>
          <div style={{ height: "90vh"}}>
            <div className="gutter-20x"></div>
            <div style={{ paddingLeft: "20px" }}>
              <h4><b>Khazana Cloud </b></h4>
            </div>
            <div className="gutter-40x"></div>
            <div className="gutter-40x"></div>
            <Menu>
              <MenuItem> 
                <Link to="/home" style={{ textDecoration: "none", color: "#212529" }}>
                  <i className="lar la-user" style={{ fontSize: "22px" }}></i> Users List
                </Link>
              </MenuItem>
              <MenuItem> 
                <Link to="/home" style={{ textDecoration: "none", color: "#212529" }}>
                  <i className="las la-cash-register" style={{ fontSize: "22px" }}></i> Pay-order List
                </Link>
              </MenuItem>
              <MenuItem> 
                <Link to="/home" style={{ textDecoration: "none", color: "#212529" }}>
                  <i className="las la-money-bill" style={{ fontSize: "22px" }}></i> Billing Calculation
                </Link>
              </MenuItem>
            </Menu>
            <Menu>
            <MenuItem 
              onClick={handleLogout}>
                <i className="las la-sign-out-alt" style={{ fontSize: "22px" }}></i> Logout
            </MenuItem>
          </Menu>
          </div>
        </Sidebar> */}
        <main style={{ width: "100%" }}> 
          <Navbar>
            <Container >
              <Navbar.Brand href="#home"><b>Home</b></Navbar.Brand>
              <Nav>
                <Nav.Link eventKey={2} href="#memes">
                  <span style={{ paddingLeft: "10px", paddingRight: "10px" }}>Hello, { sessionUser.first_name}</span>
                  <Gravatar 
                    style={{ borderRadius: "50%" }}
                    size="32"
                    email={ sessionUser.email } />
                  <span style={{ paddingRight: "20px" }}></span>
                </Nav.Link>
              </Nav>
            </Container>
          </Navbar>
          <Row>
            {/* Main panel */}
            <Col style={{ padding: "30px" }}>
                <h1>Main Home Page Content</h1>
            </Col>
          </Row>
        </main>
      </div>
    </Container>
  )
}

export default Home
