import React from 'react'
import { Col, Row, Form,Button } from 'react-bootstrap'

export default function StorageService(props) {

      //// handle storage states 

  // State to manage elasticServices, renamed to storageService

  // Handle input changes for a specific row
  const updateStorageService = (index, field, value) => {
    const updatedServices = [...props.storageService];
    updatedServices[index][field] = value;
    props.setStorageService(updatedServices);
  };

  // Add a new row
  const addStorageServiceRow = () => {
    props.setStorageService([
      ...props.storageService,
      { serviceName: "", type: "", gbs: 0, duration: 730, price: 0 },
    ]);
  };

  // Remove a row
  const removeStorageServiceRow = (index) => {
    const updatedServices = props.storageService.filter((_, i) => i !== index);
    props.setStorageService(updatedServices);
  };

  return (
    <React.Fragment>
        <div className='gutter-40x' ></div>
        <div className='splitter' ></div>
        <div className="gutter-20x"></div>
        <Row><Col><span style={{ font: "16px", fontWeight: 'bold' }}>Storage Services</span></Col></Row>
        <div className='gutter-20x' ></div>
        <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
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
        <div className='gutter-20x' ></div>
        {props.storageService.map((row, index) => (
          <>
            <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgService-${index}`}>
                  <Form.Select
                    aria-label="Select Service"
                    value={row.serviceName}
                    onChange={(e) => updateStorageService(index, "serviceName", e.target.value)}
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
                    onChange={(e) => updateStorageService(index, "type", e.target.value)}
                  >
                    {row.serviceName !== "" ?
                      <option>Select Type</option>
                      :
                      <option>Please First Select Service</option>
                    }
                    {row.serviceName === "elastic" &&
                      <>
                        <option value="SSD">General Purpose SSD (Per GB)</option>
                        <option value="HHD">HDD (Per GB)</option>
                      </>
                    }
                    {row.serviceName === "obs" && <option value="OBS">OBS for Object Data or IMS (Images)</option>}
                    {row.serviceName === "bv" && <option value="OBS-Licence">Licence + OBS</option>}
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
                    onChange={(e) => updateStorageService(index, "gbs", e.target.value)}
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
                    onChange={(e) => updateStorageService(index, "duration", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3" controlId={`fgPrice-${index}`}>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Price"
                    value={row.price}
                    onChange={(e) => updateStorageService(index, "price", e.target.value)}
                    style={{ fontSize: "16px" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                {
                  <Button variant="danger" onClick={() => removeStorageServiceRow(index)}>
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
            onClick={addStorageServiceRow}
            style={{ marginRight: "5px" }}
          >
            Add
          </Button>
        </div>
    </React.Fragment>
  )
}
