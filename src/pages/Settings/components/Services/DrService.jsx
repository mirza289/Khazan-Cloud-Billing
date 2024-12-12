import React, { useEffect } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';

export default function DrService(props) {
  // Extract unit costs from local storage
  const storedData = JSON.parse(localStorage.getItem('unitCost')) || [];
  const UNIT_COSTS = {
    vCores: storedData.find(item => item.resource_desc === 'vCores')?.unit_cost_margin || 0,
    RAM: storedData.find(item => item.resource_desc === 'Memory (GB)')?.unit_cost_margin || 0,
    CSDR: storedData.find(item => item.resource_desc === 'CSDR - (Per VM License)')?.unit_cost_margin || 0,
    HDD: storedData.find(item => item.resource_desc === 'HDD Storage (GB)')?.unit_cost_margin || 0,
    SSD: storedData.find(item => item.resource_desc === 'SSD Storage (GB)')?.unit_cost_margin || 0,
  };

  // Handle input changes for a specific row and calculate price
  const updateDrService = (index, field, value) => {
    const updatedServices = [...props.drServices];
    updatedServices[index][field] = value;

    // Extract current row details for price calculation
    const { serviceName, type, quantity, duration } = updatedServices[index];
    let monthlyPrice = 0;

    // Price calculation logic based on serviceName and type
    switch (serviceName) {
      case 'compute-resources':
        if (type === 'vcpu') {
          monthlyPrice = UNIT_COSTS.vCores * quantity * duration;
        } else if (type === 'memory') {
          monthlyPrice = UNIT_COSTS.RAM * quantity * duration;
        }
        break;
      case 'elastic-volume':
        if (type === 'g-purpose-hhd') {
          monthlyPrice = UNIT_COSTS.HDD * quantity * duration;
        } else if (type === 'g-purpose-ssd') {
          monthlyPrice = UNIT_COSTS.SSD * quantity * duration;
        }
        break;
      case 'csdr-licence':
        if (type === 'csdr-licence') {
          monthlyPrice = UNIT_COSTS.CSDR * quantity * duration;
        }
        break;
      default:
        monthlyPrice = 0;
        break;
    }

    updatedServices[index].monthlyPrice = parseFloat(monthlyPrice);
    props.setDrServices(updatedServices);
  };

  // Add a new row
  const addDrServiceRow = () => {
    props.setDrServices([
      ...props.drServices,
      { serviceName: '', type: '', quantity: 0, duration: 730, monthlyPrice: 0 },
    ]);
  };

  // Remove a row
  const removeDrServiceRow = (index) => {
    const updatedServices = props.drServices.filter((_, i) => i !== index);
    props.setDrServices(updatedServices);
  };

  const calculateTotalMonthlyPrice = () => {
    return props.drServices.reduce((sum, row) => sum + (parseFloat(row.monthlyPrice) || 0), 0);
  };

  return (
    <React.Fragment>
      <div className='gutter-40x'></div>
      <div className='splitter'></div>
      <div className="gutter-20x"></div>
      <Row>
        <Col>
          <span style={{ font: "16px", fontWeight: 'bold' }}>DR Services</span>
        </Col>
      </Row>
      <div className='gutter-20x'></div>
      <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
        <Col lg={2}>Service Name</Col>
        <Col lg={2}>Type</Col>
        <Col lg={1}>Qty</Col>
        <Col lg={2}>Duration (Hr / Month)</Col>
        <Col lg={2}>Monthly Price</Col>
      </Row>
      <div className='gutter-20x'></div>
      {props.drServices.map((row, index) => (
        <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
          <Col lg={2}>
            <Form.Group className="mb-3" controlId={`fgServiceName-${index}`}>
              <Form.Select
                aria-label="Select Service Name"
                value={row.serviceName}
                onChange={(e) => {
                  const updatedServiceName = e.target.value;
                  updateDrService(index, "serviceName", updatedServiceName);
                }}
              >
                <option>Select Service Name</option>
                <option value="csdr-licence">CSDR Licence (Without Resources)</option>
                <option value="elastic-volume">Elastic Volume Services (Total)</option>
                <option value="compute-resources">Compute Resources (Total)</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg={2}>
            <Form.Group className="mb-3" controlId={`fgType-${index}`}>
              <Form.Select
                aria-label="Select Type"
                value={row.type}
                onChange={(e) => updateDrService(index, "type", e.target.value)}
              >
                <option>Select Type</option>
                {row.serviceName === 'compute-resources' && (
                  <>
                    <option value="vcpu">vCPU</option>
                    <option value="memory">Memory</option>
                  </>
                )}
                {row.serviceName === 'elastic-volume' && (
                  <>
                    <option value="g-purpose-hhd">HDD Storage (GB)</option>
                    <option value="g-purpose-ssd">SSD Storage (GB)</option>
                  </>
                )}
                {row.serviceName === 'csdr-licence' && (
                  <option value="csdr-licence">CSDR - (Per VM License)</option>
                )}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg={1}>
            <Form.Group className="mb-3" controlId={`fgQuantity-${index}`}>
              <Form.Control
                size="lg"
                type="text"
                placeholder="Qty"
                value={row.quantity}
                onChange={(e) => updateDrService(index, "quantity", e.target.value)}
                style={{ fontSize: "16px" }}
              />
            </Form.Group>
          </Col>
          <Col lg={2}>
            <Form.Group className="mb-3" controlId={`fgDuration-${index}`}>
              <Form.Control
                size="lg"
                type="text"
                placeholder="Duration"
                value={row.duration}
                onChange={(e) => updateDrService(index, "duration", e.target.value)}
                style={{ fontSize: "16px" }}
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
                readOnly
                style={{ fontSize: "16px" }}
              />
            </Form.Group>
          </Col>
          <Col>
            <Button variant="danger" onClick={() => removeDrServiceRow(index)}>
              Remove
            </Button>
          </Col>
        </Row>
      ))}


      <Row>
        <Col>
          <Button
            variant="outline-primary"
            onClick={addDrServiceRow}
            style={{ marginRight: "5px" }}
          >
            Add
          </Button>
        </Col>
        {props.drServices.length > 0 &&
          <Col>
            <span style={{ fontWeight: "bold", float: "right" }}>
              Total Monthly Price: ${calculateTotalMonthlyPrice().toFixed(2)}
            </span>
          </Col>
        }
        <Col>
        </Col>
      </Row>

    </React.Fragment>
  );
}