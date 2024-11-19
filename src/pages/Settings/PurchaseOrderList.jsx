import React, { useState, useEffect, useRef, memo } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import InputGroup from 'react-bootstrap/InputGroup'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import moment from 'moment'
//
import { Link } from 'react-router-dom'
import SidebarMenu from '../../components/SidebarMenu'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../../components/AppHeader'
import { useDropzone } from 'react-dropzone'
import HttpClient from '../../api/HttpClient'
import data from '../../utils/data.json'
import { ListGroup } from 'react-bootstrap'
import isEmpty from '../../utils/isEmpty'
import Table from '../../shared/Table'
import Accordion from 'react-bootstrap/Accordion'


const PurchaseOrderList = () => {
  const [apiError, setApiError] = useState(null)
  const [showSpinner, setShowSpinner] = useState(false)
  const [resonseData, setResonseData] = useState({})
  const [selectedService, setSelectedService] = useState({})
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: 'audio/*',
    onDrop: acceptedFiles => {
      const selectedFile = acceptedFiles[0]
    }
  })

  const handelUploadResourceData = (e) => {

    // continue if no validation errors
    let formData = new FormData()
    formData.append('file', acceptedFiles[0])


    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        // Add this if you're using authentication
        // 'Authorization': `Bearer ${your_token_here}`,
      },
      // Enable credentials if your API requires them
      // withCredentials: true,
    }

    HttpClient.post('/upload', formData, config)
      .then(responsePayload => {
        setShowSpinner(false)
        console.log(responsePayload.data)
        setResonseData(responsePayload.data)
      })
      .catch(error => {
        setShowSpinner(false)
        if (error.response) {
          setApiError(error.response.data.message)
        } else if (error.request) {
          setApiError(error.request)
        } else {
          setApiError(error.message)
        }

      })
  }

  // const listCols = [
  //   // {
  //   //   Header: <span className="table-heading-font">ID</span>,
  //   //   accessor: 'id',
  //   //   width: 150,
  //   //   Cell: ({ cell }) => <span>{cell.value}</span>,
  //   // },
  //   {
  //     Header: <span className="table-heading-font">Resource Name</span>,
  //     accessor: 'resourceName',
  //     width: 150,
  //     Cell: ({ cell }) => <span>{cell.value}</span>,
  //   },
  //   {
  //     Header: <span className="table-heading-font">Memory</span>,
  //     accessor: 'memory',
  //     width: 80,
  //     Cell: ({ cell }) => <span>{cell.value} GB</span>,
  //   },
  //   {
  //     Header: <span className="table-heading-font">vCPUs</span>,
  //     accessor: 'vCPUs',
  //     width: 60,
  //     Cell: ({ cell }) => <span>{cell.value}</span>,
  //   },
  //   {
  //     Header: <span className="table-heading-font">Metering Metric</span>,
  //     accessor: 'meteringMetric',
  //     width: 200,
  //     Cell: ({ cell }) => <span>{cell.value}</span>,
  //   },
  //   {
  //     Header: <span className="table-heading-font">Metering Value</span>,
  //     accessor: 'meteringValue',
  //     width: 100,
  //     Cell: ({ cell }) => <span>{cell.value}</span>,
  //   },
  //   {
  //     Header: <span className="table-heading-font">Usage</span>,
  //     accessor: 'usage',
  //     width: 60,
  //     Cell: ({ cell }) => <span>{cell.value}</span>,
  //   },
  //   {
  //     Header: <span className="table-heading-font">Usage Duration</span>,
  //     accessor: 'usageDuration',
  //     width: 120,
  //     Cell: ({ cell }) => <span>{cell.value} hours</span>,
  //   },
  //   {
  //     Header: <span className="table-heading-font">Start Time</span>,
  //     accessor: 'meterBeginTime',
  //     width: 200,
  //     Cell: ({ cell }) => (
  //       <>
  //         <div>{moment.utc(cell.value).local().fromNow()}</div>
  //         <div style={{ fontSize: '10px' }}>
  //           {moment(cell.value).local().format('MM-DD-YYYY HH:mm:ss')}
  //         </div>
  //       </>
  //     ),
  //   },
  //   {
  //     Header: <span className="table-heading-font">End Time</span>,
  //     accessor: 'meterEndTime',
  //     width: 200,
  //     Cell: ({ cell }) => (
  //       <>
  //         <div>{moment.utc(cell.value).local().fromNow()}</div>
  //         <div style={{ fontSize: '10px' }}>
  //           {moment(cell.value).local().format('MM-DD-YYYY HH:mm:ss')}
  //         </div>
  //       </>
  //     ),
  //   },
  // ];

  // const columns = React.useMemo(() => {
  //   return listCols
  // })

  const handleSelectService = (item) => {
    setSelectedService(item);
  };


  const ConvertToLocalTime = memo(({ gmtTimeString }) => {
    // Convert GMT time to local time using moment.js
    const convertToLocal = (gmtTimeString) => {
      const localTime = moment(gmtTimeString).local().format('LLLL'); // Format the local time
      return localTime;
    }
  })

  return (
    <Container fluid style={{ paddingRight: "0", paddingLeft: "0" }}>
      <AppHeader />
      <div style={{ display: "flex", height: "98vh" }}>
        <SidebarMenu />
        <main style={{ width: "100%" }}>
          <div className="gutter-40x"></div>
          <div className="gutter-20x"></div>
          <Row style={{ padding: "20px" }}>
            <Col>
              <Card style={{ width: '100%', boxShadow: '0px 0px 5px 5px #e0e0e0' }}>
                <Card.Body style={{ textAlign: "center", backgroundColor: "#f0f8ff" }}>
                  <div className="gutter-10x"></div>
                  <div
                    id='DragFileArea'
                    style={{ textAlign: 'center', cursor: 'pointer' }}
                    {...getRootProps()}
                    className='dropzone-main data-upload-container'
                  >
                    <input {...getInputProps()} />
                    <i className="las la-cloud-upload-alt" style={{ fontSize: "60px", cursor: "pointer" }}></i>
                    <div className="gutter-10x"></div>
                    <Card.Subtitle className="mb-2 text-muted">Drop your resource data file here or click to browse</Card.Subtitle>
                    <div className="gutter-5x"></div>
                    {acceptedFiles.length > 0 && <p>{acceptedFiles[0].name}</p>}
                  </div>
                  <div className="gutter-20x"></div>
                  <Button variant="primary" disabled={acceptedFiles.length === 0} onClick={handelUploadResourceData}>Upload</Button>
                  <div className="gutter-10x"></div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row style={{ padding: "20px" }}>
            <Col lg={3}>
              <Card style={{ width: '100%' }}>
                <Card.Body style={{ textAlign: "center", backgroundColor: "#f0f8ff" }}>
                  <div className="gutter-20x"></div>
                  {isEmpty(resonseData) ? "No data found" :
                    <Row>
                      <Col>
                        <span style={{ color: "#717171", fontSize: '18px', float: "left" }}> <i style={{ fontSize: '24px', color: "#717171" }} className="las la-cloud"></i> {data.regions[0].regionName}</span>
                      </Col>
                      <Col>
                        <span style={{ color: "#717171", fontSize: '16px', float: "right" }}><i style={{ fontSize: '22px', color: "#717171" }} className="las la-globe-asia"></i> Pakistan</span>
                      </Col>
                    </Row>}
                  <div className="gutter-10x"></div>
                  <div className='splitter'></div>
                  <div className="gutter-20x"></div>
                  <Accordion>
                    {
                      !isEmpty(resonseData) && resonseData.regions[0].services.map((item, index) => (
                        <Accordion.Item eventKey={index}>
                          <Accordion.Header style={{ backgroundColor: "#f0f8ff" }}>{item.serviceName}</Accordion.Header>
                          <Accordion.Body style={{ backgroundColor: "#f0f8ff", overflowY:'auto', maxHeight:'20vh' }}>
                            <ListGroup variant="flush">
                              {item.instances.map((item, index) => (
                                <ListGroup.Item onClick={() => handleSelectService(item)} style={{ backgroundColor: '#c0e2ff', borderRadius: '6px', marginBottom: '5px', cursor: 'pointer', fontSize: '14px' }} key={index}>{item["Resource Name"]}
                                  {item["Service Type"] &&
                                    item["Service Type"] === "dedicated" ?
                                    <Badge bg="success" style={{ float: "right" }}>{item["Service Type"]}</Badge>
                                    :
                                    <Badge bg="primary" style={{ float: "right" }}>{item["Service Type"]}</Badge>
                                  }
                                </ListGroup.Item>
                              ))
                              }
                            </ListGroup>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))
                    }
                  </Accordion>
                  <div className="gutter-20x"></div>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{ width: '100%', backgroundColor: "#f0f8ff" }}>
                <Card.Body>
                  <div className="gutter-20x"></div>
                  {/* <Table
                    hiddenColumnsProps={[]}
                    sortByProps={[]}
                    className="data-table"
                    columns={columns}
                    selectedItems={{}}
                    data={selectedService}
                    selecteAll={true}
                    height={"table-height"}
                    showSpinnerProp={''}
                    getCellProps={cellInfo => ({
                    })}
                    getRowProps={row => ({
                      className: 'single-node'
                    })}
                  /> */}
                  {!isEmpty(selectedService) && (
                    <>
                      {Object.keys(selectedService)
                        .sort((a, b) => {
                          // Define the fixed keys that must always appear on top
                          const fixedKeys = ["Resource ID", "Resource Name"];

                          // Check if both keys are in the fixed set
                          const isAInFixed = fixedKeys.includes(a);
                          const isBInFixed = fixedKeys.includes(b);

                          // Ensure fixed keys always come first and in their defined order
                          if (isAInFixed && isBInFixed) {
                            return fixedKeys.indexOf(a) - fixedKeys.indexOf(b);
                          }
                          if (isAInFixed) return -1; // Fixed keys always come before others
                          if (isBInFixed) return 1;

                          // Sort other keys dynamically (alphabetically or as needed)
                          return a.localeCompare(b);
                        })
                        .map((key) => (
                          <div key={key}>
                            <Row>
                              <Col style={{ float: "left", fontWeight: "bold" }}>
                                {key.replace(/([A-Z])/g, "$1").replace(/^./, (str) => str.toUpperCase())}
                              </Col>
                              <Col style={{ float: "right" }}>
                                {/* {key === "Metering Metric" ? (
                                  <Badge bg="secondary" style={{ fontSize: "14px", padding: "10px" }}>
                                    {selectedService[key]}
                                  </Badge>
                                ) : (
                                  <span>{selectedService[key]}</span>
                                )} */}
                                {key !== "Metering Metric" && key !== "Meter Begin Time (UTC+05:00)" && key !== "Meter End Time (UTC+05:00)" && <span>{selectedService[key]}</span>}
                                {key === "Metering Metric" && <Badge bg="secondary" style={{ fontSize: "14px", padding: "10px" }}> {selectedService[key]}  </Badge>}
                                {key === "Meter Begin Time (UTC+05:00)" && <span style={{ fontSize: "14px", color: "#717171" }}>{moment(selectedService[key]).local().format('MM-DD-YYYY HH:mm:ss')}</span>}
                                {key === "Meter End Time (UTC+05:00)" && <span style={{ fontSize: "14px", color: "#717171" }}>{moment(selectedService[key]).local().format('MM-DD-YYYY HH:mm:ss')}</span>}
                              </Col>
                            </Row>
                            <div className="gutter-10x"></div>
                          </div>
                        ))}
                    </>
                  )}
                  <div className="gutter-20x"></div>
                  <div className='splitter'></div>
                  <div className="gutter-10x"></div>
                </Card.Body>
              </Card>
            </Col>
            {/* <Col>
              <Card style={{ width: '100%', backgroundColor: "#f0f8ff" }}>
                <Card.Body>
                  <div className="gutter-20x"></div>

                  <div className="gutter-20x"></div>
                </Card.Body>
              </Card>
            </Col> */}
          </Row>
        </main>
      </div>
    </Container>
  )
}
export default PurchaseOrderList