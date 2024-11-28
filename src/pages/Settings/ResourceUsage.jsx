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


const ResourceUsage = () => {
  const [apiError, setApiError] = useState(null)
  const [showSpinner, setShowSpinner] = useState(false)
  const [resonseData, setResonseData] = useState({})
  const [selectedService, setSelectedService] = useState({})
  const [selectedInstanceList, setSelectedIntanceList] = useState([])
  const [unitCostList, setUnitCostList] = useState([]);
  const elementRefs = useRef([]);
  const [listLoadingSpinner, setListLoadingSpinner] = useState(false);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: 'audio/*',
    onDrop: acceptedFiles => {
      const selectedFile = acceptedFiles[0]
    }
  })

  useEffect(() => {
      if (!isEmpty(selectedService)  && elementRefs.current) {
        // Find the index of the selected element
        const index = selectedInstanceList.instance.findIndex(element => element["Resource ID"] === selectedService["Resource ID"]);
        if (index !== -1 && elementRefs.current[index]) {
          // Scroll the selected element into view
          elementRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
  }, []);



  const getUnitPriceList = () => {
    setUnitCostList([]);
    setListLoadingSpinner(true);

    HttpClient.get("/unit-costs")
      .then((responsePayload) => {
        let responseData = responsePayload.data;
        setUnitCostList(responseData.unit_costs);
        console.log(responseData);
        setListLoadingSpinner(false);
      })
      .catch((error) => {
        setListLoadingSpinner(false);
        if (error.response) {
          setApiError(
            error.response.data.message +
              "[" +
              error.response.data.message_detail +
              "]"
          );
        } else if (error.request) {
          setApiError(error.request);
        } else {
          setApiError(error.message);
        }
      });
  };

  const handelUploadResourceData = (e) => {
    setShowSpinner(true)
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


  useEffect(() => {
    handelUploadResourceData()
  }, [acceptedFiles])

  useEffect(() => {
    getUnitPriceList()
  }, [])
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
                    {showSpinner && <Spinner style={{ marginRight: 10, marginTop: 5 }} animation="border" size="sm" variant="dark" role="status" />}
                  </div>
                  <div className="gutter-20x"></div>
                  {/* <Button variant="primary" disabled={acceptedFiles.length === 0} onClick={handelUploadResourceData}>Upload</Button> */}
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
                      !isEmpty(resonseData) && resonseData.regions[0].services.map((service, index) => (
                        <Accordion.Item eventKey={index} onClick={() => setSelectedIntanceList(service)}>
                          <Accordion.Header style={{ backgroundColor: "#f0f8ff" }}>{service.serviceName}</Accordion.Header>
                          <Accordion.Body style={{ backgroundColor: "#f0f8ff", overflowY: 'auto', maxHeight: '20vh' }}>
                            <ListGroup variant="flush">
                              {service.instances.map((item, index) => (
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
                  {!isEmpty(selectedService) && (
                    <>
                    </>
                    // <>
                    //   {Object.keys(selectedService)
                    //     .sort((a, b) => {
                    //       // Define the fixed keys that must always appear on top
                    //       const fixedKeys = ["Resource ID", "Resource Name"];

                    //       // Check if both keys are in the fixed set
                    //       const isAInFixed = fixedKeys.includes(a);
                    //       const isBInFixed = fixedKeys.includes(b);

                    //       // Ensure fixed keys always come first and in their defined order
                    //       if (isAInFixed && isBInFixed) {
                    //         return fixedKeys.indexOf(a) - fixedKeys.indexOf(b);
                    //       }
                    //       if (isAInFixed) return -1; // Fixed keys always come before others
                    //       if (isBInFixed) return 1;

                    //       // Sort other keys dynamically (alphabetically or as needed)
                    //       return a.localeCompare(b);
                    //     })
                    //     .map((key) => (
                    //       <div key={key}>
                    //         <Row>
                    //           <Col style={{ float: "left", fontWeight: "bold" }}>
                    //             {key.replace(/([A-Z])/g, "$1").replace(/^./, (str) => str.toUpperCase())}
                    //           </Col>
                    //           <Col style={{ float: "right" }}>
                    //             {/* {key === "Metering Metric" ? (
                    //               <Badge bg="secondary" style={{ fontSize: "14px", padding: "10px" }}>
                    //                 {selectedService[key]}
                    //               </Badge>
                    //             ) : (
                    //               <span>{selectedService[key]}</span>
                    //             )} */}
                    //             {key !== "Metering Metric" && key !== "Meter Begin Time (UTC+05:00)" && key !== "Meter End Time (UTC+05:00)" && <span>{selectedService[key]}</span>}
                    //             {key === "Metering Metric" && <Badge bg="secondary" style={{ fontSize: "14px", padding: "10px" }}> {selectedService[key]}  </Badge>}
                    //             {key === "Meter Begin Time (UTC+05:00)" && <span style={{ fontSize: "14px", color: "#717171" }}>{moment(selectedService[key]).local().format('MM-DD-YYYY HH:mm:ss')}</span>}
                    //             {key === "Meter End Time (UTC+05:00)" && <span style={{ fontSize: "14px", color: "#717171" }}>{moment(selectedService[key]).local().format('MM-DD-YYYY HH:mm:ss')}</span>}
                    //           </Col>
                    //         </Row>
                    //         <div className="gutter-10x"></div>
                    //       </div>
                    //     ))}
                    // </>
                  )}

                  <div style={{ height: '50vh', overflowY: "auto", overflowX: "hidden" }}>
                    {selectedInstanceList.length !== 0 &&
                      selectedInstanceList.instances.map((instance, i) => (
                        <div ref={(el) => elementRefs.current[i] = el}
                        key={instance["Resource ID"]} style={{ marginBottom: "20px" }}>
                          <div style={{ padding: 20, backgroundColor: "white", borderRadius: 6 }}>
                            <Badge bg="warning" style={{ fontSize: "14px", padding: "10px" }}>
                              {selectedInstanceList.serviceName + " " + (i + 1)}
                            </Badge>
                            <div className='gutter-10x'> </div>
                            <div className='splitter'> </div>
                            <div className='gutter-10x'> </div>
                            <Row>
                              {Object.keys(instance).map((key) => (
                                <Row key={key} style={{ marginBottom: "10px" }}>
                                  <Col xs={6} style={{ textAlign: "left", fontWeight: "bold" }}>
                                    {key}
                                  </Col>
                                  <Col xs={6} style={{ textAlign: "right" }}>
                                    {key.includes("Time") ? (
                                      // Format date/time fields
                                      <span style={{ fontSize: "14px", color: "#717171" }}>
                                        {moment(instance[key]).local().format("MM-DD-YYYY HH:mm:ss")}
                                      </span>
                                    ) : key === "Metering Metric" ? (
                                      // Special styling for "Metering Metric"
                                      <Badge bg="secondary" style={{ fontSize: "14px", padding: "10px" }}>
                                        {instance[key]}
                                      </Badge>
                                    ) : (
                                      // Default rendering for other fields
                                      <span>{instance[key]}</span>
                                    )}
                                  </Col>
                                </Row>
                              ))}
                            </Row>
                          </div>
                          <div className="gutter-20x"></div>
                          <div className='splitter'></div>
                          <div className="gutter-10x"></div>
                        </div>
                      ))
                    }
                  </div>
                  <div className="gutter-20x"></div>
                  <div className='splitter'></div>
                  <div className="gutter-10x"></div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </main>
      </div>
    </Container>
  )
}
export default ResourceUsage