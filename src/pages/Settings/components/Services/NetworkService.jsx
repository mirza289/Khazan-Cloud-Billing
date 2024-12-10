import React from 'react'
import { Col, Row, Form, Button } from 'react-bootstrap'

export default function NetworkService(props) {

    
  // Handle input changes for a specific row
  const updateNetworkService = (index, field, value) => {
    const updatedServices = [...props.networkServices];
    updatedServices[index][field] = value;
    props.setNetworkServices(updatedServices);
  };

  // Add a new row
  const addNetworkServiceRow = () => {
    props.setNetworkServices([
      ...props.networkServices,
      { serviceName: "", type: "", qty: 0, duration: 0, monthlyPrice: 0 },
    ]);
  };

  // Remove a row
  const removeNetworkServiceRow = (index) => {
    const updatedServices = props.networkServices.filter((_, i) => i !== index);
    props.setNetworkServices(updatedServices);
  }


  return (
    <React.Fragment>
        <div className="gutter-40x"></div>
        <div className="splitter"></div>
        <div className="gutter-20x"></div>
        <Row>
          <Col>
            <span style={{ font: "16px", fontWeight: "bold" }}>Network Services</span>
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
        {props.networkServices.map((row, index) => (
          <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgServiceName-${index}`}>
                <Form.Select
                  aria-label="Select Service Name"
                  value={row.serviceName}
                  onChange={(e) => updateNetworkService(index, "serviceName", e.target.value)}
                >
                  <option>Select Service Name</option>
                  <option value="eip">EIP - Per EIP</option>
                  <option value="banwidth">Bandwith - Per MB</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgType-${index}`}>
                <Form.Select
                  aria-label="Select Type"
                  value={row.type}
                  onChange={(e) => updateNetworkService(index, "type", e.target.value)}
                >
                  <option>Select Type</option>
                  {row.serviceName === "eip" && <option value="public-static-ip">Elastic (Public static) IP</option>}
                  {row.serviceName === "banwidth" && <option value="bandwidth">Cloud bandwidth for ELB, VPN, ECS, EIP etc</option>}
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
                  onChange={(e) => updateNetworkService(index, "qty", e.target.value)}
                  style={{ fontSize: "16px" }}
                />
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="mb-3" controlId={`fgDuration-${index}`}>
                <Form.Control
                  value={row.duration}
                  onChange={(e) => updateNetworkService(index, "duration", e.target.value)}
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
                  onChange={(e) => updateNetworkService(index, "monthlyPrice", e.target.value)}
                  style={{ fontSize: "16px" }}
                />
              </Form.Group>
            </Col>
            <Col>
              {
                <Button variant="danger" onClick={() => removeNetworkServiceRow(index)}>
                  Remove
                </Button>
              }
            </Col>
          </Row>
        ))}
        <Button
          variant="outline-primary"
          onClick={addNetworkServiceRow}
          style={{ marginRight: "5px" }}
        >
          Add
        </Button>
    </React.Fragment>
  )
}
