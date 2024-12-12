import React, { useEffect } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';

export default function StorageService(props) {
  // Extract unit costs from local storage
  const storedData = JSON.parse(localStorage.getItem('unitCost')) || [];
  const UNIT_COSTS = {
    HDD: storedData.find(item => item.resource_desc === 'HDD Storage (GB)')?.unit_cost_margin || 0,
    SSD: storedData.find(item => item.resource_desc === 'SSD Storage (GB)')?.unit_cost_margin || 0,
    OBS: storedData.find(item => item.resource_desc === 'OBS (GB)')?.unit_cost_margin || 0,
    Backup: storedData.find(item => item.resource_desc === 'Backup Capacity (GB)')?.unit_cost_margin || 0,
  };

  // Update monthly monthlyPrice based on inputs
  const updateStorageService = (index, field, value) => {
    const updatedServices = [...props.storageService];
    updatedServices[index][field] = value;

    const { serviceName, type, gbs, duration } = updatedServices[index];
    let monthlyPrice = 0;

    if (serviceName === 'elastic') {
      monthlyPrice = (type === 'SSD' ? UNIT_COSTS.SSD : UNIT_COSTS.HDD) * gbs * duration;
    } else if (serviceName === 'obs') {
      monthlyPrice = UNIT_COSTS.OBS * gbs * duration;
    } else if (serviceName === 'bv') {
      monthlyPrice = (UNIT_COSTS.OBS + UNIT_COSTS.Backup) * gbs * 730;
    }

    updatedServices[index].monthlyPrice = parseFloat(monthlyPrice);
    props.setStorageService(updatedServices);
  };

  // Add a new row
  const addStorageServiceRow = () => {
    props.setStorageService([
      ...props.storageService,
      { serviceName: '', type: '', gbs: 0, duration: 730, monthlyPrice: 0 },
    ]);
  };

  // Remove a row
  const removeStorageServiceRow = (index) => {
    const updatedServices = props.storageService.filter((_, i) => i !== index);
    props.setStorageService(updatedServices);
  };

  const calculateTotalMonthlyPrice = () => {
    return props.storageService.reduce((sum, row) => {
      const price = parseFloat(row.monthlyPrice) || 0; // Ensure monthlyPrice is a number
      return sum + price;
    }, 0); // Start with a sum of 0
  };
  
  return (
    <React.Fragment>
      <div className="gutter-40x"></div>
      <div className="splitter"></div>
      <div className="gutter-20x"></div>
      <Row>
        <Col>
          <span style={{ font: '16px', fontWeight: 'bold' }}>Storage Services</span>
        </Col>
      </Row>
      <div className="gutter-20x"></div>
      <Row style={{ fontSize: '14px', fontWeight: 'bold' }}>
        <Col lg={2}>
          <span>Service Name</span>
        </Col>
        <Col lg={2}>
          <span>Type</span>
        </Col>
        <Col lg={1}>
          <span>Size (GB)</span>
        </Col>
        <Col lg={2}>
          <span>Duration (Hr / Month)</span>
        </Col>
        <Col>
          Monthly Price
        </Col>
      </Row>
      <div className="gutter-20x"></div>
      {props.storageService.map((row, index) => (
        <>
          <Row key={index} style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgService-${index}`}>
                <Form.Select
                  aria-label="Select Service"
                  value={row.serviceName}
                  onChange={(e) => updateStorageService(index, 'serviceName', e.target.value)}
                >
                  <option>Select Service</option>
                  <option value="elastic">Elastic Volume Services</option>
                  <option value="obs">Object Storage Service (OBS)</option>
                  <option value="bv">Backup Vault</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgType-${index}`}>
                <Form.Select
                  aria-label="Select Type"
                  value={row.type}
                  onChange={(e) => updateStorageService(index, 'type', e.target.value)}
                >
                  {row.serviceName !== '' ? (
                    <option>Select Type</option>
                  ) : (
                    <option>Please First Select Service</option>
                  )}
                  {row.serviceName === 'elastic' && (
                    <>
                      <option value="SSD">General Purpose SSD (Per GB)</option>
                      <option value="HHD">HDD (Per GB)</option>
                    </>
                  )}
                  {row.serviceName === 'obs' && <option value="OBS">OBS for Object Data or IMS (Images)</option>}
                  {row.serviceName === 'bv' && <option value="OBS-Licence">Licence + OBS</option>}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={1}>
              <Form.Group className="mb-3" controlId={`fgGBs-${index}`}>
                <Form.Control
                  size="lg"
                  type="text"
                  placeholder="GBs"
                  value={row.gbs}
                  onChange={(e) => updateStorageService(index, 'gbs', e.target.value)}
                  style={{ fontSize: '16px' }}
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
                  onChange={(e) => updateStorageService(index, 'duration', e.target.value)}
                  style={{ fontSize: '16px' }}
                />
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgPrice-${index}`}>
                <Form.Control
                  size="lg"
                  type="text"
                  placeholder="Price"
                  value={row.monthlyPrice}
                  readOnly
                  style={{ fontSize: '16px' }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Button variant="danger" onClick={() => removeStorageServiceRow(index)}>
                Remove
              </Button>
            </Col>
          </Row>
        </>
      ))}
       <Row>
        <Col>
        <Button
          variant="outline-primary"
          onClick={addStorageServiceRow}
          style={{ marginRight: '5px' }}
        >
          Add
        </Button>
        </Col>
        {props.storageService.length !== 0 &&
          <Col>
            <span style={{ fontWeight: "bold", float: "right" }}> Total: ${calculateTotalMonthlyPrice().toFixed(2)} </span>
          </Col>}
        <Col>
        </Col>
      </Row>
    </React.Fragment>
  );
}