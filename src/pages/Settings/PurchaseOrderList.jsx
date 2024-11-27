import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'

//
import Gravatar from 'react-gravatar'
import { useNavigate, useParams } from 'react-router-dom'
import SlidingPane from "react-sliding-pane"
import "react-sliding-pane/dist/react-sliding-pane.css"
import moment from 'moment'
//
import HttpClient from '../../api/HttpClient'
import SidebarMenu from '../../components/SidebarMenu'
import AppHeader from '../../components/AppHeader'
import Table from '../../shared/Table'
import CreatePurchaseOrder from './components/CreatePurchaseOrder'

const PurchaseOrderList = () => {
  const navigate = useNavigate()
  const [userList, setUserList] = useState([])
  const [sessionUser, setSessionUser] = useState({})
  const [apiError, setApiError] = useState('')
  const [apiSessionError, setApiSessionError] = useState('')
  const [currentUserId, setCurrentUserId] = useState('')
  const [currentCompanyId, setCurrentCompanyId] = useState('')
  const [listLoadingSpinner, setListLoadingSpinner] = useState(false)
  const [sliderState, setSliderState] = useState({
    isPaneOpen: false,
    isPaneOpenLeft: false,
  })
  const [sliderTitle, setSliderTitle] = useState('Create User')
  const [sliderFormView, setSliderFormView] = useState('CreateUser')


  useEffect(() => {
    document.title = ("User Manage | Khazana")
    // checkUserSession()
  }, [])

  // check session user exists otherwise logout
  const checkUserSession = () => {
    setApiSessionError('')
    HttpClient.get('auth/me')
      .then(responsePayload => {
        let responseData = responsePayload.data.data
        // set the user object from the session
        setSessionUser(responseData)
        getUserList(responseData.company_id)
        setCurrentCompanyId(responseData.company_id)
      })
      .catch(error => {
        if (error.response) {
          setApiSessionError(error.response.data.message + "[" + error.response.data.message_detail + "]")
        } else if (error.request) {
          setApiSessionError(error.request)
        } else {
          setApiSessionError(error.message)
        }
      })
  }


  const getUserList = () => {
    setUserList([])
    setListLoadingSpinner(true)

    HttpClient.get('/po/get')
      .then(responsePayload => {
        let responseData = responsePayload.data.data
        setUserList(responseData)
        setListLoadingSpinner(false)
      })
      .catch(error => {
        setListLoadingSpinner(false)
        if (error.response) {
          setApiError(error.response.data.message + "[" + error.response.data.message_detail + "]")
        } else if (error.request) {
          setApiError(error.request)
        } else {
          setApiError(error.message)
        }
      })
  }

  const handelCreateUserRecord = () => {
    setSliderFormView('Create')
    setSliderTitle('Create Purchase Record')
    setSliderState({ isPaneOpen: true })
  }

  const handleEditUser = (companyId, userId) => {
    setSliderFormView("Edit")
    setSliderTitle("Edit User")
    setCurrentUserId(userId)
    setCurrentCompanyId(companyId)
    setSliderState({ isPaneOpen: true })
  }

  const listCols = [
    {
      Header: <span className='table-heading-font'>Name</span>,
      accessor: 'name',
      width: 50,
      Cell: ({ cell, row }) => (
        <>
          <Row>
            <Col sm="2">
              <Gravatar
                style={{ borderRadius: "50%" }}
                size="32"
                email={cell.value + " " + row.original.last_name}
              />
            </Col>
            <Col>
              <div>{cell.value}</div>
            </Col>
          </Row>
        </>
      ),
    },
    {
      Header: <span className='table-heading-font'>Email</span>,
      accessor: 'email',
      width: 60,
      Cell: ({ cell, row }) => (
        <span>{cell.value}</span>
      ),
    },
    {
      Header: <span className='table-heading-font'>NTN</span>,
      accessor: 'ntn_number',
      width: 30,
      Cell: ({ cell }) => (
        <span>{cell.value}</span>
      ),
    },
    {
      Header: <span className='table-heading-font'>Last Activity</span>,
      accessor: 'updated_at',
      width: 20,
      Cell: ({ cell }) => (
        <>
          <div>{moment.utc(cell.value).local().fromNow()}</div>
          <div style={{ fontSize: "10px" }}>{cell.value && moment(cell.value).local().format("MM-DD-YYYY HH:mm:ss")}</div>
        </>
      ),
    },
    {
      Header: <span className='table-heading-font'>Created</span>,
      accessor: 'created_at',
      width: 50,
      Cell: ({ cell }) => (
        <>
          <div>{moment.utc(cell.value).local().fromNow()}</div>
          <div style={{ fontSize: "10px" }}>{cell.value && moment(cell.value).local().format("MM-DD-YYYY HH:mm:ss")}</div>
        </>
      ),
    },
    {
      Header: '',
      accessor: 'action',
      width: 40,
      disableSortBy: true,
      Cell: ({ cell, row }) => (
        <div style={{ textAlign: "right" }}>
          <Button
            size="sm"
            variant="light"
            style={{ marginLeft: "4px" }}
            onClick={() => handleEditUser(row.original.company_id, row.original.user_id)}>
            <i className="las la-edit" style={{ fontSize: "20px" }}></i>
          </Button>
        </div>
      )
    },
  ]


  const columns = React.useMemo(() => {
    return listCols
  })

  const handleUserListReload = () => {
    getUserList()
  }

  const updateSliderState = (newState) => {
    setSliderState((prevState) => ({
      ...prevState,
      ...newState,
    }))
    getUserList()
  }

  return (
    <Container fluid style={{ paddingRight: "0", paddingLeft: "0" }}>
      <div style={{ display: "flex", height: "100vh" }}>
        <AppHeader
          appTitle="Manage Users"
          sessionUser={sessionUser}
          source="SystemAdmin"
        />
        {
          apiSessionError ? (
            <>
              <main style={{ width: "100%", paddingTop: "60px", padding: "100px" }}>
                <Alert className="form-global-error">{apiSessionError}</Alert>
              </main>
            </>
          ) : (
            <>
              <SidebarMenu
                sessionUser={sessionUser}
              />
              <main style={{ width: "100%", paddingTop: "60px" }}>
                <Row style={{ margin: "0" }}>
                  {/* Main panel */}
                  <Col style={{ padding: "30px" }}>
                    <Row>
                      <Col>
                        <div style={{ fontSize: "14px", color: "#909090" }}>Settings / Manage Users</div>
                      </Col>
                      <Col style={{ textAlign: "right" }}>
                      </Col>
                    </Row>
                    <div className="gutter-10x"></div>
                    <Row>
                      <Col>
                        <div style={{ fontSize: "16px", color: "#909090" }}></div>
                      </Col>
                      <Col style={{ textAlign: "right" }}>
                        <Button variant="light"
                          size="md"
                          onClick={() => handleUserListReload()}
                          style={{ fontSize: "14px", paddingLeft: "20px", paddingRight: "20px", borderRadius: "20px" }}>
                          <i className="las la-sync" style={{ fontSize: "18px" }}></i> Reload
                        </Button>
                        <span style={{ paddingRight: "10px" }}></span>
                        <Button
                          size="md"
                          onClick={() => handelCreateUserRecord()}
                          style={{ fontSize: "14px", paddingLeft: "20px", paddingRight: "20px", borderRadius: "20px", backgroundColor: "#2887d4" }}>
                          <i className="las la-user-plus" style={{ fontSize: "18px" }}></i> Add Purchase Order
                        </Button>
                      </Col>
                    </Row>
                    <div className="gutter-20x"></div>
                    <Table
                      hiddenColumnsProps={[]}
                      sortByProps={[]}
                      className="data-table"
                      columns={columns}
                      selectedItems={{}}
                      data={userList}
                      selecteAll={true}
                      height={"table-height"}
                      showSpinnerProp={listLoadingSpinner}
                      getCellProps={cellInfo => ({
                      })}
                      getRowProps={row => ({
                        className: 'single-node'
                      })}
                    />
                  </Col>
                </Row>
              </main>
              {/* user management slider pane */}
              <SlidingPane
                className="slider-class"
                overlayClassName="some-custom-overlay-class"
                isOpen={sliderState.isPaneOpen}
                title={sliderTitle}
                width="80%"
                onRequestClose={() => {
                  // triggered on "<" on left top click or on outside click
                  setSliderState({ isPaneOpen: false })
                }}>
                {
                  sliderFormView === 'Create' &&
                  <CreatePurchaseOrder
                    updateSliderState={updateSliderState}
                    companyId={currentCompanyId}
                    source={"UserManagement"}
                  />
                }
                {/* {
                  sliderFormView === "Edit" &&
                  <UserEdit
                    sessionUser={sessionUser}
                    userId={currentUserId}
                    companyId={currentCompanyId}
                    updateSliderState={updateSliderState}
                    source={ "UserManagement" }
                  />
                } */}
              </SlidingPane>
            </>
          )
        }
      </div>
    </Container>
  )
}

export default PurchaseOrderList
