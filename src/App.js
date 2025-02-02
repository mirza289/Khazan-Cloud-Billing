import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
// User modules
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import ResourceUsage from './pages/Settings/ResourceUsage'
import PurchaseOrderList from './pages/Settings/PurchaseOrderList'
import ManagePrice from './pages/Settings/ManagePrice'
import InvoiceGenerator from './pages/Settings/InvoiceGenerator'
import UsersList from './pages/Settings/UsersList'
// import Auth from './pages/Login/Auth'
// import Signup from './pages/Signup/Signup'
// import SurveyList from './pages/Survey/SurveyList/SurveyList'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/login" element={<Login />} />
        {/* Signup Wizard */}
        <Route exact path="/home" element={<Home />} />
        {/* settings module */}
        <Route exact path="settings/users-list" element={<UsersList />} />
        <Route exact path="settings/resource-usage" element={<ResourceUsage />} />
        <Route exact path="settings/po-list" element={<PurchaseOrderList />} />
        <Route exact path="settings/prices" element={<ManagePrice />} />
        <Route exact path="settings/generate-invoice" element={<InvoiceGenerator />} />

      </Routes>
    </Router>
  )
}

export default App;
