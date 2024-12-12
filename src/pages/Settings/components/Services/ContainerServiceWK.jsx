import React, { useEffect } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';

export default function ContainerServiceWK(props) {
  const storedData = JSON.parse(localStorage.getItem('unitCost')) || [];

  const UNIT_COSTS = {
    vCores: storedData.find(item => item.resource_desc === 'vCores')?.unit_cost_margin || 0,
    RAM: storedData.find(item => item.resource_desc === 'RAM (GB)')?.unit_cost_margin || 0,
    HDD: storedData.find(item => item.resource_desc === 'HDD Storage (GB)')?.unit_cost_margin || 0,
    SSD: storedData.find(item => item.resource_desc === 'SSD Storage (GB)')?.unit_cost_margin || 0,
  };

  // Calculate the monthly price based on selected service and other fields
  const calculateMonthlyPrice = (serviceName, description, vcpuQty, duration) => {
    let unitCost = 0;
    if (serviceName === 'evs') {
      if (description === 'ssd-per-gb') {
        unitCost = UNIT_COSTS.SSD;
      } else if (description === 'hdd-per-gb') {
        unitCost = UNIT_COSTS.HDD;
      }
    } else if (serviceName === 'total-worker-nodes') {
      if (description === 'ssd-per-gb') {
        unitCost = UNIT_COSTS.vCores; // Assuming vCPUs price
      } else if (description === 'hdd-per-gb') {
        unitCost = UNIT_COSTS.RAM; // Assuming RAM price
      }
    }

    // Return the calculated monthly price
    return unitCost * vcpuQty * duration;
  };

  // Handle input changes for a specific row
  const updateContainerSpecialService = (index, field, value) => {
    const updatedServices = [...props.containerSpecialServices];
    updatedServices[index][field] = value;

    // Calculate and update the monthly price after each change
    if (field === 'serviceName' || field === 'description' || field === 'vcpuQty' || field === 'duration') {
      const { serviceName, description, vcpuQty, duration } = updatedServices[index];
      updatedServices[index].monthlyPrice = calculateMonthlyPrice(serviceName, description, vcpuQty, duration);
    }

    props.setContainerSpecialServices(updatedServices);
  };

  // Add a new row
  const addContainerSpecialServiceRow = () => {
    props.setContainerSpecialServices([
      ...props.containerSpecialServices,
      { serviceName: "", description: "", vcpuQty: 0, duration: 730, monthlyPrice: 0 },
    ]);
  };

  // Remove a row
  const removeContainerSpecialServiceRow = (index) => {
    const updatedServices = props.containerSpecialServices.filter((_, i) => i !== index);
    props.setContainerSpecialServices(updatedServices);
  };


  const calculateTotalMonthlyPrice = () => {
    return props.containerSpecialServices.reduce((sum, row) => {
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
          <span style={{ font: "16px", fontWeight: "bold" }}>
            Container Services (Worker Nodes Details - If not added above in ECS and Storage service)
          </span>
        </Col>
      </Row>
      <div className="gutter-20x"></div>
      <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
        <Col lg={2}>
          <span>Service Name</span>
        </Col>
        <Col lg={2}>
          <span>Description</span>
        </Col>
        <Col lg={2}>
          <span>Worker Node vCPU Qty</span>
        </Col>
        <Col lg={2}>
          <span>Duration (Hr / Month)</span>
        </Col>
        <Col>Monthly Price</Col>
      </Row>
      <div className="gutter-10x"></div>
      {props.containerSpecialServices.map((row, index) => (
        <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
          <Col lg={2}>
            <Form.Group className="mb-3" controlId={`fgServiceName-${index}`}>
              <Form.Select
                aria-label="Select Service Name"
                value={row.serviceName}
                onChange={(e) => updateContainerSpecialService(index, "serviceName", e.target.value)}
              >
                <option>Select Service Name</option>
                <option value="evs">Elastic Volume Services (Total)</option>
                <option value="total-worker-nodes">Compute Resources for Worker Nodes (Total)</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg={2}>
            <Form.Group className="mb-3" controlId={`fgDescription-${index}`}>
              <Form.Select
                aria-label="Select Service"
                value={row.description}
                onChange={(e) => updateContainerSpecialService(index, "description", e.target.value)}
              >
                <option>Select</option>
                {
                  row.serviceName === "evs" &&
                  <>
                    <option value="ssd-per-gb">General Purpose SSD (Per GB)</option>
                    <option value="hdd-per-gb">HDD (Per GB)</option>
                  </>
                }
                {
                  row.serviceName === "total-worker-nodes" &&
                  <>
                    <option value="ssd-per-gb">vCPUs</option>
                    <option value="hdd-per-gb">Memory</option>
                  </>
                }
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg={2}>
            <Form.Group className="mb-3" controlId={`fgVcpuQty-${index}`}>
              <Form.Control
                size="lg"
                type="text"
                placeholder="Worker Node vCPU Qty"
                value={row.vcpuQty}
                onChange={(e) => updateContainerSpecialService(index, "vcpuQty", e.target.value)}
                style={{ fontSize: "16px" }}
              />
            </Form.Group>
          </Col>
          <Col lg={2}>
            <Form.Group className="mb-3" controlId={`fgDuration-${index}`}>
              <Form.Control
                value={row.duration}
                onChange={(e) => updateContainerSpecialService(index, "duration", e.target.value)}
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
            <Button variant="danger" onClick={() => removeContainerSpecialServiceRow(index)}>
              Remove
            </Button>
          </Col>
        </Row>
      ))}
      <Row>
        <Col>
          <Button
            variant="outline-primary"
            onClick={addContainerSpecialServiceRow}
            style={{ marginRight: "5px" }}
          >
            Add
          </Button>
        </Col>
        {props.containerSpecialServices.length > 0 &&
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
