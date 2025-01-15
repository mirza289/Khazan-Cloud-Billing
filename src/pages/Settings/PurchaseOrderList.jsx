import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
//
import "react-sliding-pane/dist/react-sliding-pane.css"
import { Typeahead } from 'react-bootstrap-typeahead'
//
import HttpClient from '../../api/HttpClient'
import SidebarMenu from '../../components/SidebarMenu'
import AppHeader from '../../components/AppHeader'
import CreatePurchaseOrder from './CreatePurchaseOrder'
import { toast } from 'react-toastify'

const PurchaseOrderList = () => {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [apiError, setApiError] = useState('');
  const [reload, setReload] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || !user.flags.Admin) {
      window.location.href = "/settings/resource-usage"
      return;
    }
  }, [user]);

  useEffect(() => {
    document.title = ("User Manage | Khazana")
  }, [])

  useEffect(() => {
    apiError && toast.error(apiError)
  }, [apiError])

  useEffect(() => {
    setUserList([])

    HttpClient.get('/users/get').then(responsePayload => {
      let responseData = responsePayload.data.data;
      setUserList(responseData);
    }).catch(error => {
      if (error.response) {
        if (error.response.status === 401) {
          window.location.href = "/settings/resource-usage"
          return;
        }
        setApiError(error.response.data.message);
      } else if (error.request) {
        setApiError(error.request);
      } else {
        setApiError(error.message);
      }
    })
  }, [])

  return userList.length > 0 && (
    <Container key={reload} fluid style={{ paddingRight: "0", paddingLeft: "0" }}>
      <div style={{ display: "flex", height: "100vh" }}>
        <AppHeader appTitle="Manage Users" source="SystemAdmin" />
        <SidebarMenu />

        <main style={{ width: "100%", paddingTop: "60px", overflowY: "auto" }}>
          <Row style={{ margin: "0" }}>
            {/* Main panel */}
            <Col style={{ padding: "30px" }}>
              <Row>
                <Col>
                  <div style={{ fontSize: "14px", color: "#909090" }}>Settings / Manage Purchase Order</div>
                </Col>
                <Col style={{ textAlign: "right" }}>
                </Col>
              </Row>

              <div className="gutter-20x"></div>

              <Form.Group>
                <Form.Label>Select User</Form.Label>
                <Typeahead
                  id="basic-typeahead-single"
                  labelKey={(option) => option.full_name}
                  onChange={setSelectedUser}
                  options={userList.map((user) => { return { full_name: user.full_name, id: user.id } })}
                  placeholder="Select a user..."
                  selected={selectedUser}
                />
              </Form.Group>

              {selectedUser.length > 0 && <CreatePurchaseOrder userId={selectedUser[0].id} setReload={setReload} />}
            </Col>
          </Row>
        </main>
      </div>
    </Container>
  )
}

export default PurchaseOrderList
