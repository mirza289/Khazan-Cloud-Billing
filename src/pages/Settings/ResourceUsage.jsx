import React, { useState, useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack';
import Badge from 'react-bootstrap/Badge';
//
import SidebarMenu from '../../components/SidebarMenu';
import AppHeader from '../../components/AppHeader';
import { useDropzone } from 'react-dropzone';
import HttpClient from '../../api/HttpClient';
import data from '../../utils/data.json';
import { ListGroup } from 'react-bootstrap';
import isEmpty from '../../utils/isEmpty';
import Accordion from 'react-bootstrap/Accordion';


const ResourceUsage = () => {
  const [apiError, setApiError] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [summarizedData, setSummarizedData] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [selectedService, setSelectedService] = useState({});
  const [selectedInstanceList, setSelectedIntanceList] = useState({ instances: [] });
  const [servicesCostList, setServicesCostList] = useState([]);
  const elementRefs = useRef([]);
  // const [listLoadingSpinner, setListLoadingSpinner] = useState(false)
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  useEffect(() => {
    if (!isEmpty(selectedService) && elementRefs.current) {
      // Find the index of the selected element in the instance list
      const index = selectedInstanceList.instances?.findIndex(
        (element) => element["Resource ID"] === selectedService["Resource ID"]
      );

      if (index !== -1 && elementRefs.current[index]) {
        // Scroll the selected element into view
        elementRefs.current[index].scrollIntoView({
          behavior: "smooth",
          block: "center", // Center the element vertically in the viewport
        });
      }
    }
  }, [selectedService, selectedInstanceList]);

  useEffect(() => console.log(apiError), [apiError]);

  const handelUploadResourceData = async (e) => {
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

    let responsePayload = await HttpClient.get("/unit-costs").catch((error) => {
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

    const unitCosts = responsePayload.data.unit_costs;

    HttpClient.post('/upload', formData, config)
      .then(responsePayload => {
        setShowSpinner(false);

        let data = processECSData(responsePayload.data);
        let summary = processSummary(JSON.parse(JSON.stringify(data)), unitCosts);
        setSummarizedData(summary);
        setResponseData(data);

        console.log("----Service Costs -------");

        console.log(calculateServiceCosts(data))
        setServicesCostList(calculateServiceCosts(summary));
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

  // const [servicesSummary, setServicesSummary] = useState([]);

  // Function to calculate total costs for each service
  const calculateServiceCosts = (data) => {
    const summary = [];

    data.regions.forEach(region => {
      region.services.forEach(service => {
        const serviceName = service.serviceName;
        const totalCost = service.instances.reduce((sum, instance) => {
          // Ensure 'Usage Cost' is treated as a number
          return sum + parseFloat(instance['Usage Cost'] || 0);
        }, 0);
        if (totalCost !== 0)
          summary.push({
            serviceName: serviceName,
            totalCost: totalCost.toFixed(2) // Optionally format to 2 decimal places
          });
      });
    });
    localStorage.setItem('serviceCostsSummary', JSON.stringify(summary));
    // setServicesSummary(summary); // Uncomment this if required
    return summary;
  };

  const handleSelectService = (item) => {
    setSelectedService(item);
  };

  useEffect(() => {
    if (acceptedFiles.length > 0)
      handelUploadResourceData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceptedFiles])


  function processECSData(data) {
    const regions = data.regions;

    regions.forEach(region => {
      // console.log(region.services);
      const ecsService = region.services.find(service => service.serviceName === "ECS");
      let newServices = [];

      if (ecsService) {
        // Extract clustered and dedicated instances
        const clusteredInstances = ecsService.instances.clustered || [];
        const dedicatedInstances = ecsService.instances.dedicated || [];


        // Transform the data
        const clustered = {
          serviceName: "ECS-cluster",
          instances: clusteredInstances.map(instance => ({
            "Resource Name": instance["Resource Name"] || instance["Resource ID"],
            "Resource Metric": instance["Metering Metric"],
            "vCPU": instance["vCPUs"],
            "Memory": instance["Memory"],
            "Usage Duration": instance["Usage Duration"],
            "Usage Cost": instance["Usage Cost"].toFixed(2),
          }))
        };

        const dedicated = {
          serviceName: "ECS-dedicated",
          instances: dedicatedInstances.map(instance => ({
            "Resource Name": instance["Resource Name"] || instance["Resource ID"],
            "Resource Metric": instance["Metering Metric"],
            "vCPU": instance["vCPUs"],
            "Memory": instance["Memory"],
            "Usage Duration": instance["Usage Duration"],
            "Usage Cost": instance["Usage Cost"].toFixed(2),
          }))
        };

        // Add the new objects to the services array
        region.services = region.services.filter(service => service.serviceName !== "ECS");
        newServices.push(clustered, dedicated);
      }

      for (let service of region.services) {
        newServices.push({
          serviceName: service.serviceName,
          instances: service.instances.map(instance => ({
            "Resource Name": instance["Resource Name"] || instance["Resource ID"],
            "Resource Metric": instance["Metering Metric"],
            "Usage": instance["Usage"],
            "Usage Duration": instance["Usage Duration"],
            "Metering Value": instance["Metering Value"],
            "Usage Cost": instance["Usage Cost"].toFixed(2),
          }))
        })
      }
      region.services = newServices;
    });

    return data;
  }

  function processSummary(data, unitCosts) {
    const regions = data.regions;

    regions.forEach(region => {
      const ecsCluster = region.services.find(service => service.serviceName.toLowerCase() === "ecs-cluster");
      const ecsDedicated = region.services.find(service => service.serviceName.toLowerCase() === "ecs-dedicated");
      const evsService = region.services.find(service => service.serviceName.toLowerCase() === "evs");
      const eipService = region.services.find(service => service.serviceName.toLowerCase() === "eip");
      const vpnService = region.services.find(service => service.serviceName.toLowerCase() === "virtual private network");
      const bwService = region.services.find(service => service.serviceName.toLowerCase() === "bandwidth");
      let newServices = [];

      if (ecsCluster) {
        const groupedData = {};

        ecsCluster.instances.forEach(instance => {
          const key = `${instance["vCPU"]}-${instance["Memory"]}`;

          if (!groupedData[key]) {
            groupedData[key] = {
              "Resource": instance['Resource Metric'],
              "vCPU": instance['vCPU'],
              "Memory": instance['Memory'],
              totalDuration: 0,
              totalCost: 0,
              count: 0,
            };
          }

          groupedData[key].totalDuration += parseFloat(instance["Usage Duration"]);
          groupedData[key].totalCost += parseFloat(instance["Usage Cost"]);
          groupedData[key].count++;
        });

        let ecsClusterSummary = []

        for (const key in groupedData) {
          const group = groupedData[key];
          ecsClusterSummary.push({
            "Resource": group['Resource'],
            "vCPU": group['vCPU'],
            "Memory": group['Memory'],
            "Quantity": group.count,
            "Avg Duration": (group.totalDuration / group.count).toFixed(2),
            "Usage Cost": group.totalCost.toFixed(2)
          });
        }

        // Add the new objects to the services array
        region.services = region.services.filter(service => service.serviceName.toLowerCase() !== "ecs-cluster");
        newServices.push({
          serviceName: ecsCluster.serviceName,
          instances: ecsClusterSummary
        })
      }

      if (ecsDedicated) {
        const groupedData = {};

        ecsDedicated.instances.forEach(instance => {
          const key = `${instance["vCPU"]}-${instance["Memory"]}`;

          if (!groupedData[key]) {
            groupedData[key] = {
              "Resource": instance['Resource Metric'],
              "vCPU": instance['vCPU'],
              "Memory": instance['Memory'],
              totalDuration: 0,
              totalCost: 0,
              count: 0,
            };
          }

          groupedData[key].totalDuration += parseFloat(instance["Usage Duration"]);
          groupedData[key].totalCost += parseFloat(instance["Usage Cost"]);
          groupedData[key].count++;
        });

        let ecsDedicatedSummary = []

        for (const key in groupedData) {
          const group = groupedData[key];
          ecsDedicatedSummary.push({
            "Resource": group['Resource'],
            "vCPU": group['vCPU'],
            "Memory": group['Memory'],
            "Quantity": group.count,
            "Avg Duration": (group.totalDuration / group.count).toFixed(2),
            "Usage Cost": group.totalCost.toFixed(2)
          });
        }

        // Add the new objects to the services array
        region.services = region.services.filter(service => service.serviceName.toLowerCase() !== "ecs-dedicated");
        newServices.push({
          serviceName: ecsDedicated.serviceName,
          instances: ecsDedicatedSummary
        })
      }

      if (evsService) {
        const evsSsd = evsService.instances.filter(instance => instance["Resource Metric"].toLowerCase().includes('ssd'));
        const evsSnapshot = evsService.instances.filter(instance => instance["Resource Metric"].toLowerCase().includes('snapshot'));
        const evsSata = evsService.instances.filter(instance => instance["Resource Metric"].toLowerCase().includes('sata'));
        let newEvsService = []

        if (evsSsd.length > 0) {
          let summaryEvsSSD = {
            "Resource": "EVS SSD",
            "Resource Metric": "SSD",
            "Size (GB)": 0,
            "Avg Duration": 0,
            "Usage Cost": 0
          }

          evsSsd.forEach(instance => {
            summaryEvsSSD["Size (GB)"] += parseInt(instance["Usage"]);
            summaryEvsSSD["Avg Duration"] += parseFloat(instance["Metering Value"]);
            summaryEvsSSD["Usage Cost"] += parseFloat(instance["Usage Cost"]);
          })
          summaryEvsSSD["Avg Duration"] = summaryEvsSSD["Avg Duration"] / summaryEvsSSD["Size (GB)"];

          if (evsSnapshot.length > 0) {
            let summaryEvsSnapshot = {
              "Size (GB)": 0,
              "Avg Duration": 0,
              "Usage Cost": 0
            }

            evsSnapshot.forEach(instance => {
              summaryEvsSnapshot["Size (GB)"] += parseInt(instance["Usage"]);
              summaryEvsSnapshot["Avg Duration"] += parseFloat(instance["Metering Value"]);
              summaryEvsSnapshot["Usage Cost"] += parseFloat(instance["Usage Cost"]);
            })
            summaryEvsSnapshot["Avg Duration"] = summaryEvsSnapshot["Avg Duration"] / summaryEvsSnapshot["Size (GB)"]

            summaryEvsSSD["Avg Duration"] = (summaryEvsSSD["Avg Duration"] + summaryEvsSnapshot["Avg Duration"]) / 2
            summaryEvsSSD["Usage Cost"] = summaryEvsSSD["Usage Cost"] + summaryEvsSnapshot["Usage Cost"];
            summaryEvsSSD["Size (GB)"] = summaryEvsSSD["Size (GB)"] + summaryEvsSnapshot["Size (GB)"];
          }

          summaryEvsSSD["Usage Cost"] = summaryEvsSSD["Usage Cost"].toFixed(2);
          summaryEvsSSD["Avg Duration"] = summaryEvsSSD["Avg Duration"].toFixed(2)

          newEvsService.push(summaryEvsSSD);
        }

        if (evsSata.length > 0) {
          let summaryEvsSata = {
            "Resource": "EVS SATA",
            "Resource Metric": "SATA",
            "Size (GB)": 0,
            "Avg Duration": 0,
            "Usage Cost": 0
          }

          evsSata.forEach(instance => {
            summaryEvsSata["Size (GB)"] += parseInt(instance["Usage"]);
            summaryEvsSata["Avg Duration"] += parseFloat(instance["Metering Value"]);
            summaryEvsSata["Usage Cost"] += parseFloat(instance["Usage Cost"]);
          })

          summaryEvsSata["Usage Cost"] = summaryEvsSata["Usage Cost"].toFixed(2);
          summaryEvsSata["Avg Duration"] = (summaryEvsSata["Avg Duration"] / summaryEvsSata["Size (GB)"]).toFixed();
          // if (summaryEvsSata["Avg Duration"] > 715) {
          //   summaryEvsSata["Avg Duration"] = "730";
          // }

          newEvsService.push(summaryEvsSata);
        }

        // Add the new objects to the services array
        region.services = region.services.filter(service => service.serviceName.toLowerCase() !== "evs");
        newServices.push({
          serviceName: evsService.serviceName,
          instances: newEvsService
        })
      }

      if (eipService) {
        let eipServiceSummary = {
          "Resource": "EIP",
          "Resource Metric": "Elastic IP",
          "Quantity": 0,
          "Avg Duration": 0,
          "Usage Cost": 0
        }

        eipService.instances.forEach(instance => {
          eipServiceSummary["Quantity"] += 1;
          eipServiceSummary["Avg Duration"] += parseFloat(instance["Metering Value"]);
          eipServiceSummary["Usage Cost"] += parseFloat(instance["Usage Cost"]);
        })

        eipServiceSummary["Usage Cost"] = eipServiceSummary["Usage Cost"].toFixed(2);
        eipServiceSummary["Avg Duration"] = (eipServiceSummary["Avg Duration"] / eipServiceSummary["Quantity"]).toFixed(2);

        // Add the new objects to the services array
        region.services = region.services.filter(service => service.serviceName.toLowerCase() !== "eip");
        newServices.push({
          serviceName: eipService.serviceName,
          instances: [eipServiceSummary]
        })
      }

      if (vpnService) {
        let vpnServiceSummary = {
          "Resource": "Virtual Private Network",
          "Resource Metric": "VPN",
          "Quantity": 0,
          "Avg Duration": 0,
          "Usage Cost": 0
        };

        vpnService.instances.forEach(instance => {
          vpnServiceSummary["Quantity"] += 1;
          vpnServiceSummary["Avg Duration"] += parseFloat(instance["Metering Value"]);
          vpnServiceSummary["Usage Cost"] += parseFloat(instance["Usage Cost"]);
        });

        vpnServiceSummary["Usage Cost"] = vpnServiceSummary["Usage Cost"].toFixed(2);
        vpnServiceSummary["Avg Duration"] = (vpnServiceSummary["Avg Duration"] / vpnServiceSummary["Quantity"]).toFixed(2);

        // Add the new objects to the services array
        region.services = region.services.filter(service => service.serviceName.toLowerCase() !== "virtual private network");
        newServices.push({
          serviceName: vpnService.serviceName,
          instances: [vpnServiceSummary]
        })
      }

      if (bwService) {
        let bwServiceSummary = {
          "Resource": "Bandwidth",
          "Resource Metric": "Bandwidth",
          "Quantity": 0,
          "Duration": 0,
          "Usage Cost": 0
        }

        const bwUnitCost = unitCosts.find(unitCost => unitCost.resource_desc.toLowerCase().includes("bandwidth"));

        // bwService.instances
        bwServiceSummary["Quantity"] = Math.max(...bwService.instances.map(instance => instance['Usage']));
        bwServiceSummary["Duration"] = Math.max(...bwService.instances.map(instance => instance['Usage Duration']));
        bwServiceSummary["Usage Cost"] = (bwServiceSummary["Quantity"] * bwServiceSummary['Duration'] * bwUnitCost.unit_cost_margin).toFixed(2);

        // Add the new objects to the services array
        region.services = region.services.filter(service => service.serviceName.toLowerCase() !== "bandwidth");
        newServices.push({
          serviceName: "All-Bandwidth",
          instances: [bwServiceSummary]
        })
      }

      for (let service of region.services) {
        newServices.push(service);
      }
      region.services = newServices;
    });
    return data;
  }

  const validServices = ["ecs", "evs", "eip", "all-bandwidth", 'ecs-cluster', 'ecs-dedicated', 'virtual private network']; // List of valid service names

  const calculatePrice = (seletecdService) => {
    if (!isEmpty(selectedInstanceList)) {
      const serviceName = selectedInstanceList.serviceName?.toLowerCase(); // Safely get the service name in lowercase
      if (validServices.includes(serviceName)) {
        // Calculate the total price for all instances
        const totalPrice = selectedInstanceList.instances.reduce((total, instance) => {
          // Accumulate the price of each instance
          const price = parseFloat(instance["Usage Cost"]) || 0.0; // Default to 0 if no price is provided
          return total + price; // Add price to total
        }, 0);
        return totalPrice.toFixed(2); // Return the total price
      }
    }
  }

  return (
    <Container fluid style={{ paddingRight: "0", paddingLeft: "0" }}>
      <AppHeader />
      <div style={{ display: "flex", height: "98vh" }}>
        <SidebarMenu />
        <main style={{ width: "100%" }}>
          <div className="gutter-40x"></div>
          <div className="gutter-20x"></div>
          <Row style={{ padding: "20px", paddingBottom: "10", paddingTop: "10" }}>
            <Col>
              <Card style={{ width: '100%', boxShadow: '0px 0px 5px 5px #e0e0e0' }}>
                <Card.Body style={{ textAlign: "center", backgroundColor: "#f0f8ff" }}>
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
                  {/* <Button variant="primary" disabled={acceptedFiles.length === 0} onClick={handelUploadResourceData}>Upload</Button> */}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {!isEmpty(responseData) &&
            <Row style={{ padding: "20px" }}>
              <Col lg={3}>
                <Card style={{ width: '100%' }}>
                  <Card.Body style={{ textAlign: "center", backgroundColor: "#f0f8ff" }}>
                    <div className="gutter-20x"></div>
                    {isEmpty(responseData) ? "No data found" :
                      <Row>
                        <Col>
                          <span style={{ color: "#717171", fontSize: '18px', float: "left" }}> <i style={{ fontSize: '24px', color: "#717171" }} className="las la-cloud"></i> {data.regions[0].regionName}</span>
                        </Col>
                        <Col>
                          <span style={{ color: "#717171", fontSize: '16px', float: "right" }}><i style={{ fontSize: '22px', color: "#717171" }} className="las la-globe-asia"></i> Pakistan</span>
                        </Col>
                      </Row>
                    }
                    <div className="gutter-10x"></div>
                    <div className='splitter'></div>
                    <div className="gutter-20x"></div>
                    <Accordion>
                      {
                        !showSummary && !isEmpty(responseData) && responseData.regions[0].services.map((service, index) => (
                          <Accordion.Item eventKey={index} onClick={() => setSelectedIntanceList(service)} key={index}>
                            <Accordion.Header style={{ backgroundColor: "#f0f8ff" }}>{service.serviceName}</Accordion.Header>
                            <Accordion.Body style={{ backgroundColor: "#f0f8ff", overflowY: 'auto', maxHeight: '20vh' }}>
                              <ListGroup variant="flush">
                                {
                                  (service.instances.map((item, index) => (
                                    <ListGroup.Item onClick={() => handleSelectService(item)} style={{ backgroundColor: '#c0e2ff', borderRadius: '6px', marginBottom: '5px', cursor: 'pointer', fontSize: '14px' }} key={index}>
                                      {item["Resource Name"]}
                                    </ListGroup.Item>
                                  )))
                                }
                              </ListGroup>
                            </Accordion.Body>
                          </Accordion.Item>
                        ))
                      }
                      {
                        showSummary && !isEmpty(summarizedData) && summarizedData.regions[0].services.map((service, index) => (
                          <Accordion.Item eventKey={index} onClick={() => setSelectedIntanceList(service)}>
                            <Accordion.Header style={{ backgroundColor: "#f0f8ff" }}>{service.serviceName}</Accordion.Header>
                            <Accordion.Body style={{ backgroundColor: "#f0f8ff", overflowY: 'auto', maxHeight: '20vh' }}>
                              <ListGroup variant="flush">
                                {
                                  (service.instances.map((item, index) => (
                                    <ListGroup.Item onClick={() => handleSelectService(item)} style={{ backgroundColor: '#c0e2ff', borderRadius: '6px', marginBottom: '5px', cursor: 'pointer', fontSize: '14px' }} key={index}>
                                      {item["Resource"] || item["Resource Name"]}
                                    </ListGroup.Item>
                                  )))
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
                    <div style={{ height: '50vh', overflowY: "auto", overflowX: "hidden" }}>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            {
                              selectedInstanceList?.instances?.length > 0 &&
                              Object.keys(selectedInstanceList.instances[0]).map((key, i) => {
                                return <th key={i}>{key}</th>
                              })
                            }
                          </tr>
                        </thead>
                        <tbody>
                          {
                            selectedInstanceList?.instances?.length > 0 &&
                            selectedInstanceList.instances.map((instance, i) => {
                              return (
                                <tr key={i} style={{
                                  height: "30px"
                                }}>
                                  {Object.keys(instance).map((key, index) => {
                                    return <td key={index}>{instance[key]}</td>
                                  })}
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </Table>
                    </div>
                    <div className="gutter-20x"></div>
                    <div className='splitter'></div>

                    {
                      selectedInstanceList?.instances?.length > 0 &&
                      validServices.includes((selectedInstanceList.serviceName).toLowerCase()) &&
                      <Row style={{ fontSize: "14px", fontWeight: "bold", padding: 20, backgroundColor: "white", borderRadius: 6 }}>
                        <Col>
                        </Col>
                        <Col>
                          <Badge bg="light" style={{ fontSize: "18px", padding: "10px", color: "black" }}>
                            {'Total Service Cost : $' + calculatePrice(selectedInstanceList)}
                          </Badge>
                        </Col>
                      </Row>
                    }

                    <Stack gap={2} className="col-md-5 mx-auto">
                      {
                        selectedInstanceList?.instances?.length > 0 &&
                        <Form>
                          <Form.Switch type="switch" id="custom-switch" label="Show Summary" onChange={() => {
                            let newShowSummaryState = !showSummary;
                            let newSelectedService = {};
                            let selectedServiceName = selectedInstanceList.serviceName;
                            if (newShowSummaryState) {
                              newSelectedService = summarizedData.regions[0].services.find(service => service.serviceName === selectedServiceName);
                            } else {
                              newSelectedService = responseData.regions[0].services.find(service => service.serviceName === selectedServiceName);
                            }
                            setShowSummary(newShowSummaryState);
                            setSelectedIntanceList(newSelectedService);
                          }} />
                        </Form>
                      }

                      <Button
                        size="sm"
                        variant="light"
                        style={{ marginLeft: "4px" }}
                        onClick={() => {
                          const key = 'invoiceData';
                          localStorage.setItem(key, JSON.stringify(servicesCostList)); // Save to local storage
                          window.open('/settings/generate-invoice', '_blank'); // Open the new tab
                        }}
                      >
                        Preview Invoice
                      </Button>
                    </Stack>
                    {/* <InvoiceGenerator /> */}
                    <div className="gutter-10x"></div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>}
        </main>
      </div>
    </Container >
  )
}
export default ResourceUsage