import React, { useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
//
import Gravatar from 'react-gravatar'
// import { useNavigate } from 'react-router-dom'
//
import AppHeader from '../../components/AppHeader'
import SidebarMenu from '../../components/SidebarMenu'

const Home = () => {
  // const navigate = useNavigate()

  // const [collapsed, setCollapsed] = useState(false)
  // const [sessionUser, setSessionUser] = useState({})
  // const [apiError, setApiError] = useState('')

  useEffect(() => {
  // checkUserSession()
  }, [])

  // check session user exists otherwise logout
  // const checkUserSession = () => {
  //   HttpClient.get('auth/me')
  //     .then(responsePayload => {
  //       // set the user object from the session
  //       setSessionUser(responsePayload.data.data)
  //     })
  //     .catch(error => {
  //       // in case of any error take the user to login page as this is unauthorized
  //       navigate("/")
  //     })
  // }

  // handle logout functionality
  // function handleLogout() {
  //   HttpClient.get('auth/logout')
  //     .then(responsePayload => {
  //       navigate("/")
  //     })
  //     .catch(error => {
  //       // in case of any error take the user to login page as this is unauthorized
  //       navigate("/")
  //     })
  // }

  return (
    <Container fluid style={{ paddingRight: "0", paddingLeft: "0"}}>
      <AppHeader />
      <div style={{ display: "flex", height: "98vh" }}>
        <SidebarMenu />
        <main style={{ width: "100%" }}> 
          <Navbar>
            <Container >
              <Navbar.Brand href="#home"><b>Home</b></Navbar.Brand>
              <Nav>
                <Nav.Link eventKey={2} href="#memes">
                  <span style={{ paddingLeft: "10px", paddingRight: "10px" }}>Hello, Tester</span>
                  <Gravatar 
                    style={{ borderRadius: "50%" }}
                    size={32}
                    email="test@example.com" />
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
