import React from 'react'
import { Col, Row, Form, Button } from 'react-bootstrap'

export default function SecurityService(props) {

    
  // Handle input changes for a specific row
  const updateSecurityService = (index, field, value) => {
    const updatedServices = [...props.securityServices];
    updatedServices[index][field] = value;
    props.setSecurityServices(updatedServices);
  };

  // Add a new row
  const addSecurityServiceRow = () => {
    props.setSecurityServices([
      ...props.securityServices,
      { serviceName: "", type: "", description: "", duration: 730, monthlyPrice: 0 },
    ]);
  };

  // Remove a row
  const removeSecurityServiceRow = (index) => {
    const updatedServices = props.securityServices.filter((_, i) => i !== index);
    props.setSecurityServices(updatedServices);
  };


  return (
    <React.Fragment>
         <div className='gutter-40x' ></div>
        <div className='splitter' ></div>
        <div className="gutter-20x"></div>
        <Row><Col><span style={{ font: "16px", fontWeight: 'bold' }}>Security and Protection Services</span></Col></Row>
        <div className='gutter-20x' ></div>
        <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
          <Col lg={2}>
            <span>Service Name</span>
          </Col>
          <Col lg={2}>
            <span>Type</span>
          </Col>
          <Col lg={2}>
            <span>Qty </span>
          </Col>
          <Col lg={2}>
            <span>Duration (Hr / Month)</span>
          </Col>
          <Col>
            Monthly Price
          </Col>
        </Row>
        <div className='gutter-20x'></div>
        {props.securityServices.map((row, index) => (
          <>
            <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgServiceName-${index}`}>
                  <Form.Select
                    aria-label="Select Service Name"
                    value={row.serviceName}
                    onChange={(e) => updateSecurityService(index, "serviceName", e.target.value)}
                  >
                    <option>Select Service Name</option>
                    <option value="hss">Host Security Service - HSS</option>
                    <option value="waf">WAF</option>
                    <option value="edge-fw">Edge FW</option>
                    <option value="cloud-fw">Cloud FW</option>
                    <option value="hsm-kms">HSM / KMS (Per Key)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgType-${index}`}>
                  <Form.Select
                    aria-label="Select Type"
                    value={row.type}
                    onChange={(e) => updateSecurityService(index, "type", e.target.value)}
                  >
                    <option>Select Type</option>
                    {row.serviceName === "hss" && <option value="host-ecs-security">Host Security Service - Per ECS Licence</option>}
                    {row.serviceName === "waf" && <option value="waf">Web Application Firewall (Per 100 Mbps)</option>}
                    {row.serviceName === "edge-fw" && <option value="efe-protection">Edge Firewall External Protection from Edge based on vCPU of protected ECS</option>}
                    {row.serviceName === "cloud-fw" && <option value="cfe-protection">Cloud Firewall for internal Protection based on vCPU of protected ECS</option>}
                    {row.serviceName === "hsm-kms" && <option value="kms-protection">KMS Encryption (Per Key)</option>}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgDescription-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Description"
                    value={row.description}
                    onChange={(e) => updateSecurityService(index, "description", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgDuration-${index}`}>
                  <Form.Control
                    aria-label="Select Duration"
                    value={row.duration}
                    onChange={(e) => updateSecurityService(index, "duration", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgMonthlyPrice-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Monthly Price"
                    value={row.monthlyPrice}
                    onChange={(e) => updateSecurityService(index, "monthlyPrice", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                {
                  <Button variant="danger" onClick={() => removeSecurityServiceRow(index)}>
                    Remove
                  </Button>
                }
              </Col>
            </Row>
          </>
        ))}
        <Button
          variant="outline-primary"
          onClick={addSecurityServiceRow}
          style={{ marginRight: "5px" }}

        >
          Add
        </Button>
    </React.Fragment>
  )
}
