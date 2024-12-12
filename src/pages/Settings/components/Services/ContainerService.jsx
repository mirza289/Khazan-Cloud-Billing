import React from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';

export default function ContainerService(props) {
  const storedData = JSON.parse(localStorage.getItem('unitCost')) || [];
  const UNIT_COST = storedData.find(item => item.resource_desc === 'CCE - per (vCPU)')?.unit_cost_margin || 0


  // Handle input changes for a specific row and calculate price
  const updateContainerService = (index, field, value) => {
    const updatedServices = [...props.containerServices];
    updatedServices[index][field] = value;

    // Recalculate the price based on vcpuQty and duration
    const { vcpuQty, duration } = updatedServices[index];
    const monthlyPrice = (vcpuQty || 0) * (duration || 0) * UNIT_COST;
    updatedServices[index].monthlyPrice = parseFloat(monthlyPrice.toFixed(2));

    props.setContainerServices(updatedServices);
  };

  // Add a new row
  const addContainerServiceRow = () => {
    props.setContainerServices([
      ...props.containerServices,
      { serviceName: 'CCE Cluster', vcpuQty: 0, duration: 730, monthlyPrice: 0 },
    ]);
  };

  // Remove a row
  const removeContainerServiceRow = (index) => {
    const updatedServices = props.containerServices.filter((_, i) => i !== index);
    props.setContainerServices(updatedServices);
  };

  const calculateTotalMonthlyPrice = () => {
    return props.containerServices.reduce((sum, row) => {
      const price = parseFloat(row.monthlyPrice) || 0; // Ensure monthlyPrice is a number
      return sum + price;
    }, 0); // Start with a sum of 0
  };
  


  return (
    <React.Fragment>
      <div className='gutter-40x'></div>
      <div className='splitter'></div>
      <div className='gutter-20x'></div>
      <Row>
        <Col>
          <span style={{ font: '16px', fontWeight: 'bold' }}>Container Services (CCE Cluster)</span>
        </Col>
      </Row>
      <div className='gutter-20x'></div>
      <Row style={{ fontSize: '14px', fontWeight: 'bold' }}>
        <Col lg={3}>Service Name</Col>
        <Col lg={2}>vCPU Qty</Col>
        <Col lg={2}>Duration (Hours/Month)</Col>
        <Col lg={2}>Monthly Price</Col>
      </Row>
      <div className='gutter-10x'></div>
      {props.containerServices.map((row, index) => (
        <Row key={index} style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>
          <Col lg={3}>
            <Form.Group className='mb-3' controlId={`fgServiceName-${index}`}>
              <Form.Control
                size='lg'
                type='text'
                placeholder='Service Name'
                value={row.serviceName}
                readOnly
                style={{ fontSize: '16px' }}
              />
            </Form.Group>
          </Col>
          <Col lg={2}>
            <Form.Group className='mb-3' controlId={`fgVcpuQty-${index}`}>
              <Form.Control
                size='lg'
                type='text'
                placeholder='vCPU Qty'
                value={row.vcpuQty}
                onChange={(e) => updateContainerService(index, 'vcpuQty', parseFloat(e.target.value) || 0)}
                style={{ fontSize: '16px' }}
              />
            </Form.Group>
          </Col>
          <Col lg={2}>
            <Form.Group className='mb-3' controlId={`fgDuration-${index}`}>
              <Form.Control
                size='lg'
                type='number'
                placeholder='Duration'
                value={row.duration}
                onChange={(e) => updateContainerService(index, 'duration', parseFloat(e.target.value) || 0)}
                style={{ fontSize: '16px' }}
              />
            </Form.Group>
          </Col>
          <Col lg={2}>
            <Form.Group className='mb-3' controlId={`fgMonthlyPrice-${index}`}>
              <Form.Control
                size='lg'
                type='text'
                placeholder='Monthly Price'
                value={row.monthlyPrice}
                readOnly
                style={{ fontSize: '16px' }}
              />
            </Form.Group>
          </Col>
          <Col>
            <Button variant='danger' onClick={() => removeContainerServiceRow(index)}>
              Remove
            </Button>
          </Col>
        </Row>
      ))}
      <Row>
        <Col>
          <Button
            variant='outline-primary'
            onClick={addContainerServiceRow}
            style={{ marginRight: '5px' }}
          >
            Add
          </Button>
        </Col>
        {props.containerServices.length !== 0 &&
          <Col>
            <span style={{ fontWeight: "bold", float: "right" }}> Total: ${calculateTotalMonthlyPrice().toFixed(2)} </span>
          </Col>}
        <Col>
        </Col>
      </Row>
    </React.Fragment>
  );
}
