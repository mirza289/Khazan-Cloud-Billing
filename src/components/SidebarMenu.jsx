import React, { useState, useEffect } from 'react'
//
import { Link } from 'react-router-dom'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'
import { useNavigate, useLocation } from 'react-router-dom'

//
const SidebarMenu = (props) => {
  const navigate = useNavigate()
  const currentUrlLocaltion = useLocation()

  const [isMobileScreen, setIsMobileScreen] = useState(false)
  const [collapsedWidth, setCollapsedWidth] = useState("1px")
  const checkIfMobileScreen = () => {
    setIsMobileScreen(window.innerWidth <= 768) // Adjust the threshold value as needed
  }

  useEffect(() => {
    checkIfMobileScreen()
    if (isMobileScreen) {
      setCollapsedWidth("0")
    }
    else {
      setCollapsedWidth("70px")
    }

    window.addEventListener('resize', checkIfMobileScreen);

    return () => {
      window.removeEventListener('resize', checkIfMobileScreen);
    }

  }, [isMobileScreen])

  return (
    <Sidebar collapsed={props.collapsed}
      style={{ zIndex: 0 }}
      collapsedWidth={0}
      width="200px">
      <Menu>
        <div className="gutter-40x"></div>
        <div className="gutter-40x"></div>
        <div style={{ paddingLeft: "10px", color: "#909090", fontSize: "14px" }}>Users</div>
        <div className="gutter-10x"></div>
        {/* <MenuItem 
            component={<Link to={"/settings/survey-manage"} />} 
            className={ currentUrlLocaltion.pathname === "/settings/survey-manage" ? "menuitem-survey" : "menuitme-normal"}
            style={{ textDecoration: "none" }}> 
            <i className="las la-poll" style={{ fontSize: "30px" }}></i> New Survey
          </MenuItem> */}
        <MenuItem
          component={<Link to={"/settings/calls-list"} />}
          className={currentUrlLocaltion.pathname === "/settings/calls-list" ? "menuitem-survey" : "menuitme-normal"}
          style={{ textDecoration: "none" }}>
          <i className="las la-list" style={{ fontSize: "30px", marginTop: '-3px', marginRight: "8px", float: 'left' }}></i> Users List
        </MenuItem>
        <div className="gutter-40x"></div>
        <div style={{ paddingLeft: "10px", color: "#909090", fontSize: "14px" }}>Prices</div>
        <div className="gutter-10x"></div>
        <MenuItem
          component={<Link to={"/settings/prices"} />}
          className={currentUrlLocaltion.pathname === "/settings/prices" ? "menuitem-active" : "menuitme-normal"}
          style={{ textDecoration: "none" }}>
          <i className="las la-tags" style={{ fontSize: "30px", marginTop: '-3px', marginRight: "8px", float: 'left' }}></i> Cloud Prices
        </MenuItem>
        <div className="gutter-40x"></div>
        <div style={{ paddingLeft: "10px", color: "#909090", fontSize: "14px" }}>Purchase-order</div>
        <div className="gutter-10x"></div>
        <MenuItem
          component={<Link to={"/settings/po-list"} />}
          className={currentUrlLocaltion.pathname === "/settings/po-list" ? "menuitem-active" : "menuitme-normal"}
          style={{ textDecoration: "none" }}>
          <i className="las la-cash-register" style={{ fontSize: "30px", marginTop: '-3px', marginRight: "8px", float: 'left' }}></i> Purchase-order List
        </MenuItem>
        <div className="gutter-40x"></div>
        <div className="menu-divider"></div>
        <div style={{ paddingLeft: "10px", color: "#909090", fontSize: "14px" }}>Usage</div>
        <div className="gutter-10x"></div>
        <MenuItem
          component={<Link to={"/settings/resource-usage"} />}
          className={currentUrlLocaltion.pathname === "/settings/resource-usage" ? "menuitem-active" : "menuitme-normal"}
          style={{ textDecoration: "none" }}>
          <i className="las la-money-bill" style={{ fontSize: "30px", marginTop: '-3px', marginRight: "8px", float: 'left' }}></i> Resource Usage
        </MenuItem>
      </Menu>
    </Sidebar>
  )
}

export default SidebarMenu
