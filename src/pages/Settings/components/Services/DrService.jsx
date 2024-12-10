import React from 'react'
import { Col, Row, Form,Button } from 'react-bootstrap'

export default function DrService(props) {

      // Handle input changes for a specific row
  const updateDrService = (index, field, value) => {
    const updatedServices = [...props.drServices];
    updatedServices[index][field] = value;
    props.setDrServices(updatedServices);
  };

  // Add a new row
  const addDrServiceRow = () => {
    props.setDrServices([
      ...props.drServices,
      { serviceName: "", type: "", quantity: 0, duration: 730, monthlyPrice: 0 },
    ])
  }

  // Remove a row
  const removeDrServiceRow = (index) => {
    const updatedServices = props.drServices.filter((_, i) => i !== index);
    props.setDrServices(updatedServices);
  }

  return (
    <React.Fragment>
        <div className='gutter-40x' ></div>
        <div className='splitter' ></div>
        <div className="gutter-20x"></div>
        <Row><Col><span style={{ font: "16px", fontWeight: 'bold' }}>DR Services</span></Col></Row>
        <div className='gutter-20x' ></div>
        <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
          <Col lg={2}>
            <span>Service Name</span>
          </Col>
          <Col lg={2}>
            <span>Type</span>
          </Col>
          <Col lg={1}>
            <span>Qty </span>
          </Col>
          <Col lg={2}>
            <span>Duration (Hr / Month)</span>
          </Col>
          <Col lg={2}>
            Monthly Price
          </Col>
        </Row>
        <div className='gutter-20x' ></div>
        {props.drServices.map((row, index) => (
          <>
            <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgServiceName-${index}`}>
                  <Form.Select
                    aria-label="Select Service Name"
                    value={row.serviceName}
                    onChange={(e) => updateDrService(index, "serviceName", e.target.value)}
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
                    <option value="non-protected">No of Protected ECS</option>
                    <option value="g-purpose-ssd">General Purpose SSD (Per GB)</option>
                    <option value="g-purpose-hhd">General Purpose HHD (Per GB)</option>
                    <option value="vcpu">vCPU</option>
                    <option value="memory">Memory</option>
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
                    value={row.duration}
                    onChange={(e) => updateDrService(index, "duration", e.target.value)}
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
                    onChange={(e) => updateDrService(index, "monthlyPrice", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                {
                  <Button variant="danger" onClick={() => removeDrServiceRow(index)}>
                    Remove
                  </Button>
                }
              </Col>
            </Row>
          </>
        ))}
        <Button
          variant="outline-primary"
          onClick={addDrServiceRow}
          style={{ marginRight: "5px" }}
        >
          Add
        </Button>
    </React.Fragment>
  )
}
