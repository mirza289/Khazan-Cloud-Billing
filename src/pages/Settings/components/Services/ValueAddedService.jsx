import React from 'react'
import { Col, Row, Form, InputGroup } from 'react-bootstrap'

export default function ValueAddedService(props) {
  console.log(props.additionalServices);
  // Handle checkbox changes
  const handleCheckboxChange = (serviceName) => {
    props.setAdditionalServices((prevState) => {
      const exists = prevState.data.some((service) => service.serviceName === serviceName);

      if (exists) {
        // Remove service if it already exists
        return {
          ...prevState,
          data: prevState.data.filter((service) => service.serviceName !== serviceName),
        };
      }

      // Add new service with default values
      return {
        ...prevState,
        data: [
          ...prevState.data,
          { serviceName, price: "", qty: "", id: exists?.id },
        ],
      };
    });
  };

  // Handle price changes
  const handlePriceChange = (serviceName, price) => {
    props.setAdditionalServices((prevState) => ({
      ...prevState,
      data: prevState.data.map((service) =>
        service.serviceName === serviceName
          ? { ...service, price }
          : service
      ),
    }))
  }

  // Handle quantity changes
  const handleQtyChange = (serviceName, qty) => {
    props.setAdditionalServices((prevState) => ({
      ...prevState,
      data: prevState.data.map((service) =>
        service.serviceName === serviceName
          ? { ...service, qty }
          : service
      ),
    }))
  }

  return (
    <React.Fragment>
      <div className="gutter-10x"></div>
      <div className="splitter"></div>
      <div className="gutter-20x"></div>
      <Row>
        <Col>
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>
            Value Added (Free Services)
          </span>
        </Col>
      </Row>
      <div className="gutter-20x"></div>
      <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
        {/* Column 1 */}
        <Col lg={6}>
          {[
            "elasticLoadBalancer",
            "natSet",
            "smnSet",
            "autoScaling",
            "vpn",
          ].map((service) => (
            <div key={service} style={{ marginBottom: "10px" }}>
              <Row>
                <Col>
                  <Form.Check
                    type="checkbox"
                    label={service
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^\w/, (c) => c.toUpperCase())}
                    checked={props.additionalServices.data.some((s) => s.serviceName === service)}
                    onChange={() => handleCheckboxChange(service)}
                  />
                </Col>
                {props.additionalServices.data.some((s) => s.serviceName === service) && (
                  <>
                    <Col>
                      <InputGroup>
                        <InputGroup.Text id="basic-addon1" style={{ marginTop: "5px" }}>Price</InputGroup.Text>
                        <Form.Control
                          type="number"
                          min={0}
                          placeholder="Enter Price"
                          value={
                            props.additionalServices.data.find((s) => s.serviceName === service)?.price || 0
                          }
                          onChange={(e) => handlePriceChange(service, e.target.value)}
                          style={{ marginTop: "5px", fontSize: "14px", float: "right" }}
                        />
                      </InputGroup>
                    </Col>
                    <Col>
                      <InputGroup>
                        <InputGroup.Text id="basic-addon1" style={{ marginTop: "5px" }}>Qty</InputGroup.Text>
                        <Form.Control
                          type="number"
                          min={0}
                          placeholder="Enter Qty"
                          value={
                            props.additionalServices.data.find((s) => s.serviceName === service)?.qty || 0
                          }
                          onChange={(e) => handleQtyChange(service, e.target.value)}
                          style={{ marginTop: "5px", fontSize: "14px", float: "right" }}
                        />
                      </InputGroup>
                    </Col>
                  </>
                )}
              </Row>
            </div>
          ))}
        </Col>
        {/* Column 2 */}
        <Col lg={6}>
          {[
            "imageManagementService",
            "virtualPrivateCloud",
            "dns",
            "monitoringService",
            "securityGroups",
            "accessControlList",
          ].map((service) => (
            <div key={service} style={{ marginBottom: "10px" }}>
              <Form.Check
                type="checkbox"
                label={service
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^\w/, (c) => c.toUpperCase())}
                checked={props.additionalServices.data.some((s) => s.serviceName === service)}
                onChange={() => handleCheckboxChange(service)}
              />
              {props.additionalServices.data.some((s) => s.serviceName === service) && (
                <>
                  <Form.Control
                    type="text"
                    placeholder="Enter Price"
                    value={
                      props.additionalServices.data.find((s) => s.serviceName === service)?.price || ""
                    }
                    onChange={(e) => handlePriceChange(service, e.target.value)}
                    style={{ marginTop: "5px", fontSize: "14px" }}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Enter Qty"
                    value={
                      props.additionalServices.data.find((s) => s.serviceName === service)?.qty || ""
                    }
                    onChange={(e) => handleQtyChange(service, e.target.value)}
                    style={{ marginTop: "5px", fontSize: "14px" }}
                  />
                </>
              )}
            </div>
          ))}
        </Col>
      </Row>
    </React.Fragment>
  )
}
