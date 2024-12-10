import React from 'react'
import { Col, Row, Form,Button } from 'react-bootstrap'

export default function ElasticService(props) {

  // Handle input changes for a specific row
  const handleInputChange = (index, field, value) => {
    const updatedRows = [...props.elasticServices];
    updatedRows[index][field] = value;
    props.setElasticServices(updatedRows);
  };

  // Add a new row
  const addRow = () => {
    props.setElasticServices([
      ...props.elasticServices,
      { vCPUs: 0, ram: 0, quantity: 0, rate: 0, monthlyPrice: 0 },
    ]);
  };

  // Remove a row
  const removeRow = (index) => {
    const updatedRows = props.elasticServices.filter((_, i) => i !== index);
    props.setElasticServices(updatedRows);
  };


  return (
    <React.Fragment>
        <div className='gutter-40x' ></div>
        <div className='splitter' ></div>
        <div className="gutter-20x"></div>
        <Row><Col><span style={{ font: "16px", fontWeight: 'bold' }}>Elastic Cloud Server/ Virtual Machines</span></Col></Row>
        <div className='gutter-20x' ></div>
        <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
          <Col lg={2}>
            <span>Virtual Machine</span>
          </Col>
          <Col lg={1}>
            <span>vCPUs</span>
          </Col>
          <Col lg={1}>
            <span>RAM (GB)</span>
          </Col>
          <Col lg={1}>
            <span>Quantity</span>
          </Col>
          <Col lg={2}>
            <span>Monthly Per ECS (unit price)</span>
          </Col>
          <Col lg={2}>
            <span>Monthly Price</span>
          </Col>
        </Row>
        <div className='gutter-20x' ></div>
        {props.elasticServices.map((row, index) => (
          <>
            <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
              <Col lg={2}>
                {/* <Form.Group className="mb-3" controlId={`fgServiceName-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    value={row.serviceName}
                    onChange={(e) => handleInputChange(index, "serviceName", e.target.value)}
                    placeholder="Service Name"
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group> */}
                {index + 1}
              </Col>
              <Col lg={1}>
                <Form.Group className="mb-3" controlId={`fgCPUs-${index}`}>
                  <Form.Select
                    aria-label=""
                    value={row.vCPUs}
                    onChange={(e) => handleInputChange(index, "vCPUs", e.target.value)}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                    <option value="16">16</option>
                    <option value="32">32</option>
                    <option value="48">48</option>
                    <option value="64">64</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={1}>
                <Form.Group className="mb-3" controlId={`fgRAM-${index}`}>
                  <Form.Select
                    aria-label=""
                    value={row.ram}
                    onChange={(e) => handleInputChange(index, "ram", e.target.value)}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                    <option value="16">16</option>
                    <option value="32">32</option>
                    <option value="48">48</option>
                    <option value="64">64</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={1}>
                <Form.Group className="mb-3" controlId={`fgQuantity-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    value={row.quantity}
                    onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                    placeholder="0"
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgRate-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    value={row.rate}
                    onChange={(e) => {
                      handleInputChange(index, "rate", e.target.value)
                      handleInputChange(index, "monthlyPrice", (e.target.value * 730))
                    }}
                    placeholder="Set Rate"
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgRate-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    value={row.monthlyPrice}
                    // disabled={true}
                    onChange={(e) => handleInputChange(index, "monthlyPrice", e.target.value)}
                    placeholder="Monthly Rate"
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                {
                  <Button variant="danger" onClick={() => removeRow(index)}>
                    Remove
                  </Button>
                }
              </Col>
            </Row>
          </>
        ))}
        <div>
          <Button
            variant="outline-primary"
            onClick={addRow}
            style={{ marginRight: "5px" }}
          >
            Add
          </Button>
        </div>
    </React.Fragment>
  )
}
