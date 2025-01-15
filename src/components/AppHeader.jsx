import React, { useEffect } from 'react'
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap'
import '../App.css';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

//
import Gravatar from 'react-gravatar'
import HttpClient from '../api/HttpClient';
import { toast } from 'react-toastify';

function AppHeader(props) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (props.sourceType === "login") return;
    HttpClient.get("/unit-costs")
      .then((responsePayload) => {
        let responseData = responsePayload.data;
        localStorage.setItem("unitCost", JSON.stringify(responseData.unit_costs));
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            window.location.href = "/settings/resource-usage";
            return;
          }
          console.log(error.response.data.message);
        }
      });
  }, [props.sourceType])

  function handleLogout() {
    HttpClient.get(
      'users/logout'
    ).then(responsePayload => {
      toast.success(responsePayload.data.message);
      localStorage.removeItem("user");
      navigate("/");
      return;
    })
  }

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div style={{
      backgroundColor: "white",
      width: "180px",
      height: "40px",
      borderRadius: "5px",
      display: "flex",
      alignItems: "center",
      paddingLeft: "6px"
    }}
      ref={ref}
      onClick={(e) => { e.preventDefault(); onClick(e); }} >
      {children}
      &#x25bc;
    </div>
  ));

  return (
    <Navbar
      expand="lg"
      fixed="top"
      style={{ backgroundColor: "#777777", height: "60px" }}>
      <Container fluid style={{ justifyContent: "" }} >
        <Navbar.Brand
          style={{ cursor: "pointer" }}
          onClick=
          {() => {
            navigate("/settings/resource-usage")
          }}
        >
          <Link to="/settings/resource-usage">
            <img
              style={{
                float: 'left',
                width: '48px',
                height: "31px",
                marginTop: "7px"
              }}
              src={require("../assets/images/cloud-logo.png")}
              alt="Logo" />
            <span style={{ float: 'left', padding: 10, fontWeight: '400', color: "white" }}> Khazana Cloud </span>
          </Link>
        </Navbar.Brand>
        <Nav.Link eventKey={1}>
          {
            props.sourceType !== "login" &&
            <Dropdown>
              <Dropdown.Toggle as={CustomToggle}>
                <Gravatar style={{ borderRadius: "50%" }} size={32} email={user?.email} />
                <span style={{ margin: "10px", fontWeight: "bold", color: "darkgray" }}>{user?.full_name.split(' ')[0]}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="1" onClick={handleLogout}><span style={{ fontWeight: "600" }}>Logout</span></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          }
        </Nav.Link>
      </Container>
    </Navbar>
  );
}

export default AppHeader