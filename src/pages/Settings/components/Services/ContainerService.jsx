import React from 'react'
import { Col, Row, Form,Button } from 'react-bootstrap'

export default function ContainerService(props) {

  // Handle input changes for a specific row
  const updateContainerService = (index, field, value) => {
    const updatedServices = [...props.containerServices];
    updatedServices[index][field] = value;
    props.setContainerServices(updatedServices);
  };

  // Add a new row
  const addContainerServiceRow = () => {
    props.setContainerServices([
      ...props.containerServices,
      { serviceName: "CCE Cluster", description: "CCE Cluster", vcpuQty: 0, duration: 730, monthlyPrice: 0 },
    ]);
  };

  // Remove a row
  const removeContainerServiceRow = (index) => {
    const updatedServices = props.containerServices.filter((_, i) => i !== index);
    props.setContainerServices(updatedServices);
  };
  return (
    <React.Fragment>
        <div className='gutter-40x' ></div>
        <div className='splitter' ></div>
        <div className="gutter-20x"></div>
        <Row><Col><span style={{ font: "16px", fontWeight: 'bold' }}>Container Services (CCE Cluster/ Management Platform)</span></Col></Row>
        <div className='gutter-20x' ></div>
        <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
          <Col lg={2}>
            <span>Service Name</span>
          </Col>
          <Col lg={2}>
            <span>Type</span>
          </Col>
          <Col lg={2}>
            <span>Qty Worker Node vCPUs </span>
          </Col>
          <Col lg={2}>
            <span>Duration (Hr / Month)</span>
          </Col>
          <Col>
            Monthly Price
          </Col>
        </Row>
        <div className='gutter-10x' ></div>
        {props.containerServices.map((row, index) => (
          <>
            <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgServiceName-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Service Name"
                    value={row.serviceName}
                    onChange={(e) => updateContainerService(index, "serviceName", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgDescription-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Description"
                    value={row.description}
                    onChange={(e) => updateContainerService(index, "description", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgVcpuQty-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Worker Node vCPU Qty"
                    value={row.vcpuQty}
                    onChange={(e) => updateContainerService(index, "vcpuQty", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgDuration-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Worker Node vCPU Qty"
                    value={row.duration}
                    onChange={(e) => updateContainerService(index, "duration", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                  {/* <Form.Select
                aria-label="Select Duration"
                value={row.duration}
                onChange={(e) => updateContainerService(index, "duration", e.target.value)}
              >
                <option>Select Duration</option>
                <option value="hourly">Hourly</option>
                <option value="monthly">Monthly</option>
              </Form.Select> */}
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgMonthlyPrice-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Monthly Price"
                    value={row.monthlyPrice}
                    onChange={(e) => updateContainerService(index, "monthlyPrice", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                {
                  <Button variant="danger" onClick={() => removeContainerServiceRow(index)}>
                    Remove
                  </Button>
                }
              </Col>
            </Row>
          </>
        ))}
        {
          <Button
            variant="outline-primary"
            onClick={addContainerServiceRow}
            style={{ marginRight: "5px" }}
          >
            Add
          </Button>
        }
    </React.Fragment>
  )
}
