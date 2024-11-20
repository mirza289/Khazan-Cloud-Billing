import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
// 
import Signup from './pages/Signup/Signup'
//
import Login from './pages/Login/Login'
//
import Home from './pages/Home/Home'
// User modules
import Auth from './pages/Login/Auth'
import ResourceUsage from './pages/Settings/ResourceUsage'
import PurchaseOrderList from './pages/Settings/PurchaseOrderList'
// import SurveyList from './pages/Survey/SurveyList/SurveyList'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/login" element={<Login />} />
        {/* Signup Wizard */}
        {/* <Route exact path="/signup" element={<Signup />} /> */}
        <Route exact path="/home" element={<Home />} />
                {/* <Route exact path="settings/home" element={<SettingsHome />} /> */}
        {/* settings module */}
        <Route exact path="settings/auth/:url_email" element={<Auth />} />
        <Route exact path="settings/resource-usage" element={<ResourceUsage />} />
        <Route exact path="settings/po-list" element={<PurchaseOrderList />} />

       {/* <Route exact path="/settings/survey-list" element={<SurveyList />} /> */}
        {/* <Route exact path="settings/calls-list/" element={<SurveyList />} /> */}
        {/* <Route exact path="settings/survey-preview/:survey_id" element={<PreviewElement />} /> */}
      </Routes>
    </Router>
  )
}

export default App;
