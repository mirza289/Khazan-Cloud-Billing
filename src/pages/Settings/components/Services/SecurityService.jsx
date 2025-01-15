import React from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';

export default function SecurityService(props) {

  // Unit costs for each service, extracted from localStorage or hardcoded if needed
  const storedData = JSON.parse(localStorage.getItem('unitCost')) || [];

  const UNIT_COSTS = {
    hss: storedData.find(item => item.resource_desc === 'HSS (Per VM)')?.unit_cost_margin || 0,
    waf: storedData.find(item => item.resource_desc === 'WAF - (Per 100 Mbps)')?.unit_cost_margin || 0,
    cfw: storedData.find(item => item.resource_desc === 'CFW - (Per vCPU)')?.unit_cost_margin || 0,
    efw: storedData.find(item => item.resource_desc === 'EFW - (Per vCPU)')?.unit_cost_margin || 0,
    hsmKms: storedData.find(item => item.resource_desc === 'HSM/KMS (per Key)')?.unit_cost_margin || 0,
  };

  // Calculate the monthly price based on selected service and quantity
  const calculateMonthlyPrice = (serviceName, type, qty, duration) => {
    let unitCost = 0;

    switch (serviceName) {
      case 'hss':
        if (type === 'host-ecs-security') {
          unitCost = UNIT_COSTS.hss;
        }
        break;
      case 'waf':
        if (type === 'waf') {
          unitCost = UNIT_COSTS.waf;
        }
        break;
      case 'edge-fw':
        if (type === 'efe-protection') {
          unitCost = UNIT_COSTS.efw;
        }
        break;
      case 'cloud-fw':
        if (type === 'cfe-protection') {
          unitCost = UNIT_COSTS.cfw;
        }
        break;
      case 'hsm-kms':
        if (type === 'kms-protection') {
          unitCost = UNIT_COSTS.hsmKms;
        }
        break;
      default:
        break;
    }

    // Return the calculated monthly price
    return unitCost * qty * duration;
  };

  // Handle input changes for a specific row
  const updateSecurityService = (index, field, value) => {
    const updatedServices = [...props.securityServices];
    updatedServices[index][field] = value;

    // Recalculate the monthly price after any change
    if (['serviceName', 'type', 'qty', 'duration'].includes(field)) {
      const { serviceName, type, qty, duration } = updatedServices[index];
      updatedServices[index].monthlyPrice = calculateMonthlyPrice(serviceName, type, qty, duration);
    }

    props.setSecurityServices(updatedServices);
  };

  // Add a new row
  const addSecurityServiceRow = () => {
    props.setSecurityServices([
      ...props.securityServices,
      { serviceName: "", type: "", description: "", qty: 0, duration: 730, monthlyPrice: 0 },
    ]);
  };

  // Remove a row
  const removeSecurityServiceRow = (index) => {
    const updatedServices = props.securityServices.filter((_, i) => i !== index);
    props.setSecurityServices(updatedServices);
  };

  const calculateTotalMonthlyPrice = () => {
    return props.securityServices.reduce((sum, row) => {
      const price = parseFloat(row.monthlyPrice); // Ensure monthlyPrice is a number
      return sum + price;
    }, 0); // Start with a sum of 0
  };

  return (
    <React.Fragment>
      <div className='gutter-40x'></div>
      <div className='splitter'></div>
      <div className="gutter-20x"></div>
      <Row>
        <Col><span style={{ font: "16px", fontWeight: 'bold' }}>Security and Protection Services</span></Col>
      </Row>
      <div className='gutter-20x'></div>
      <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
        <Col lg={2}><span>Service Name</span></Col>
        <Col lg={2}><span>Type</span></Col>
        <Col lg={2}><span>Qty</span></Col>
        <Col lg={2}><span>Duration (Hr / Month)</span></Col>
        <Col><span>Monthly Price</span></Col>
      </Row>
      <div className='gutter-20x'></div>
      {props.securityServices.map((row, index) => (
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
                {row.serviceName === "edge-fw" && <option value="efe-protection">Edge Firewall (Per vCPU)</option>}
                {row.serviceName === "cloud-fw" && <option value="cfe-protection">Cloud Firewall (Per vCPU)</option>}
                {row.serviceName === "hsm-kms" && <option value="kms-protection">KMS Encryption (Per Key)</option>}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg={2}>
            <Form.Group className="mb-3" controlId={`fgQty-${index}`}>
              <Form.Control
                size="lg"
                type="number"
                value={row.qty}
                onChange={(e) => updateSecurityService(index, "qty", e.target.value)}
                placeholder="Qty"
              />
            </Form.Group>
          </Col>
          <Col lg={2}>
            <Form.Group className="mb-3" controlId={`fgDuration-${index}`}>
              <Form.Control
                type="number"
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
                value={row.monthlyPrice}
                readOnly
                placeholder="Monthly Price"
              />
            </Form.Group>
          </Col>
          <Col>
            <Button variant="danger" onClick={() => removeSecurityServiceRow(index)}>
              Remove
            </Button>
          </Col>
        </Row>
      ))}
      <Row>
        <Col>
          <Button
            variant="outline-primary"
            onClick={addSecurityServiceRow}
            style={{ marginRight: "5px" }}
          >
            Add
          </Button>
        </Col>
        {props.securityServices.length !== 0 &&
          <Col>
            <span style={{ fontWeight: "bold", float: "right" }}> Total: ${calculateTotalMonthlyPrice()} </span>
          </Col>}
        <Col>
        </Col>
      </Row>
    </React.Fragment>
  );
}
