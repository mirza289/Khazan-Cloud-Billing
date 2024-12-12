import React from 'react'
import { Col, Row, Form, Button } from 'react-bootstrap'


export default function DatabaseService(props) {
  const storedData = JSON.parse(localStorage.getItem('unitCost')) || [];
  const UNIT_COST = storedData.find(item => item.resource_desc === 'DB as a Service')?.unit_cost_margin || 0

  // Handle input changes for a specific row
  const updateDatabaseService = (index, field, value) => {
    const updatedServices = [...props.databaseServices];
    updatedServices[index][field] = value;

    // Recalculate the price based on vcpuQty and duration
    const { qty, duration } = updatedServices[index];
    const monthlyPrice = (qty || 0) * (duration || 0) * UNIT_COST;
    updatedServices[index].monthlyPrice = parseFloat(monthlyPrice);

    props.setDatabaseServices(updatedServices);
  };

  // Add a new row
  const addDatabaseServiceRow = () => {
    props.setDatabaseServices([
      ...props.databaseServices,
      { serviceName: 1, type: "", qty: 0, duration: 730, monthlyPrice: 0 },
    ]);
  };

  // Remove a row
  const removeDatabaseServiceRow = (index) => {
    const updatedServices = props.databaseServices.filter((_, i) => i !== index);
    props.setDatabaseServices(updatedServices);
  }

  const calculateTotalMonthlyPrice = () => {
    return props.databaseServices.reduce((sum, row) => {
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
          <span style={{ font: "16px", fontWeight: "bold" }}>Database as a Service</span>
        </Col>
      </Row>
      <div className="gutter-20x"></div>
      <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
        <Col lg={2}>
          <span>Service Name</span>
        </Col>
        <Col lg={2}>
          <span>Type</span>
        </Col>
        <Col lg={2}>
          <span>Qty</span>
        </Col>
        <Col lg={2}>
          <span>Duration (Hr / Month)</span>
        </Col>
        <Col>Monthly Price</Col>
      </Row>
      <div className="gutter-10x"></div>
      {props.databaseServices.map((row, index) => (
        <>
          <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgServiceName-${index}`}>
                <Form.Select
                  aria-label="Select Service Name"
                  value={row.serviceName}
                  onChange={(e) => updateDatabaseService(index, "serviceName", e.target.value)}
                >
                  <option>Select Service Name</option>
                  <option value="das">Database as a Service (per vCPU Licence)</option>

                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgType-${index}`}>
                <Form.Select
                  aria-label="Select Type"
                  value={row.type}
                  onChange={(e) => updateDatabaseService(index, "type", e.target.value)}
                >
                  <option>Select Type</option>
                  <option value="das-service">MySQL, Mongo DB, Redis etc</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgQty-${index}`}>
                <Form.Control
                  size="lg"
                  type="text"
                  placeholder="Qty"
                  value={row.qty}
                  onChange={(e) => updateDatabaseService(index, "qty", e.target.value)}
                  style={{ fontSize: "16px" }}
                />
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgDuration-${index}`}>
                <Form.Control
                  aria-label="Select Duration"
                  value={row.duration}
                  onChange={(e) => updateDatabaseService(index, "duration", e.target.value)}
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
                  onChange={(e) => updateDatabaseService(index, "monthlyPrice", e.target.value)}
                  style={{ fontSize: "16px" }}
                />
              </Form.Group>
            </Col>
            <Col>
              {
                <Button variant="danger" onClick={() => removeDatabaseServiceRow(index)}>
                  Remove
                </Button>
              }
            </Col>
          </Row>
        </>
      ))}
      <Row>
        <Col>
          <Button
            variant="outline-primary"
            onClick={addDatabaseServiceRow}
            style={{ marginRight: "5px" }}
          >
            Add
          </Button>
        </Col>
        {props.databaseServices.length > 0 &&
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
  )
}
