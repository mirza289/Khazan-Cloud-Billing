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
      style={{ backgroundColor: "#777777", height: "60px" }}>
      <Container
        fluid
        style={{ justifyContent: "" }}
      >
        <Navbar.Brand
          style={{ cursor: "pointer" }}
          onClick=
          {() => {
            if (currentUrlLocaltion.pathname === "/settings/survey-manage/" + survey_id)
              navigate("/home")
          }}
        >
          <Link to="/home">
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
          {props.sourceType !== "login" && <Gravatar
            style={{ borderRadius: "50%" }}
            size="32"
            email={"Shahriyar" + " " + "Baig"}
          />}
        </Nav.Link>
      </Container>
    </Navbar>
  );
}

export default AppHeader