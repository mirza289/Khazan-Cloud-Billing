import React, { useEffect, useState } from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import '../App.css';
import { Link, NavLink } from 'react-router-dom'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

//
import Gravatar from 'react-gravatar'

function AppHeader(props) {
  const currentUrlLocaltion = useLocation()
  const navigate = useNavigate()
  const { survey_id } = useParams()

  return (
    <Navbar
      expand="lg"
      fixed="top"
      style={{ backgroundColor: "#E9F5FE", height: "60px" }}>
      <Container
        fluid
        style={{ justifyContent: "" }}
      >
        <Navbar.Brand
          style={{ cursor: "pointer" }}
          onClick=
          {() => {
            if (currentUrlLocaltion.pathname === "/settings/survey-manage/" + survey_id)
              navigate("/settings/home")
          }}
        >
          <Link to="/settings/home">
          <img 
            style={{
              float:'left',
              width: '48px',
              height:"31px"    
             }}
            src={require("../assets/images/cloud-logo.png")}
            alt="Logo" />
            <span style={{ float:'left',padding: 10, fontWeight:'400'}}> Khazana Cloud Billing</span>
          </Link>
        </Navbar.Brand>
        <Nav.Link eventKey={1}>
          {/* <span style={{ paddingLeft: "10px", paddingRight: "10px" }}>{
            props.sessionUser.first_name &&
            props.sessionUser.first_name + " " + props.sessionUser.last_name
          }</span> */}
          <Gravatar
            style={{ borderRadius: "50%" }}
            size="32"
            email={"Shahriya" + " " + "Baig"}
          />
        </Nav.Link>
      </Container>
    </Navbar>
  );
}

export default AppHeader