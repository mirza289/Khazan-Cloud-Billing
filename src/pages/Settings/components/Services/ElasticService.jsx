/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';


export default function ElasticService(props) {
  const storedData = JSON.parse(localStorage.getItem("unitCost"));
  let vCpus_Price = 0
  let ramPrice = 0
  function getObjectByResourceDesc(data, resourceDesc) {
    return data.find(item => item.resource_desc === resourceDesc);
  }

  useEffect(() => {
    console.log("Elastic Service: ", props.elasticServices);
    if (storedData.length !== 0) {
      vCpus_Price = getObjectByResourceDesc(storedData, "vCores")
      ramPrice = getObjectByResourceDesc(storedData, "RAM (GB)")
    }
  }, [storedData])


  const handleInputChange = (index, field, value) => {
    const updatedRows = [...props.elasticServices];
    updatedRows[index][field] = value;

    // Perform cost calculation when vCPUs, RAM, or quantity changes
    if (field === 'vCPUs' || field === 'ram' || field === 'quantity') {
      const vCPUsCost = updatedRows[index].vCPUs * vCpus_Price.unit_cost_margin * 730; // Monthly cost for vCPUs
      const ramCost = updatedRows[index].ram * ramPrice.unit_cost_margin * 730;       // Monthly cost for RAM
      const monthlyUnitPrice = vCPUsCost + ramCost; // Sum of vCPUs and RAM costs

      updatedRows[index].rate = monthlyUnitPrice.toFixed(2); // Update monthly per ECS rate
      updatedRows[index].monthlyPrice = (
        monthlyUnitPrice * (updatedRows[index].quantity || 0)
      ).toFixed(2); // Calculate monthly price
    }

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

  // Calculate the total monthly price
  const calculateTotalMonthlyPrice = () => {
    return props.elasticServices.reduce((sum, row) => sum + parseFloat(row.rate * row.quantity), 0).toFixed(2);
  };

  return (
    <React.Fragment>
      <div className='gutter-40x'></div>
      <div className='splitter'></div>
      <div className='gutter-20x'></div>
      <Row>
        <Col>
          <span style={{ font: "16px", fontWeight: 'bold' }}>
            Elastic Cloud Server/ Virtual Machines
          </span>
        </Col>
      </Row>
      <div className='gutter-20x'></div>
      <Row style={{ fontSize: "14px", fontWeight: "bold" }}>
        <Col lg={2}><span>Virtual Machine</span></Col>
        <Col lg={1}><span>vCPUs</span></Col>
        <Col lg={1}><span>RAM (GB)</span></Col>
        <Col lg={1}><span>Quantity</span></Col>
        <Col lg={2}><span>Monthly Per ECS (unit price)</span></Col>
        <Col lg={2}><span>Monthly Price</span></Col>
      </Row>
      <div className='gutter-20x'></div>
      {props.elasticServices.map((row, index) => (
        <Row key={index} style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
          <Col lg={2}>{index + 1}</Col>
          <Col lg={1}>
            <Form.Group className="mb-3" controlId={`fgCPUs-${index}`}>
              <Form.Select
                aria-label=""
                value={row.vCPUs}
                onChange={(e) => handleInputChange(index, "vCPUs", Number(e.target.value))}
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="8">8</option>
                <option value="16">16</option>
                <option value="32">32</option>
                <option value="64">64</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg={1}>
            <Form.Group className="mb-3" controlId={`fgRAM-${index}`}>
              <Form.Select
                aria-label=""
                value={row.ram}
                onChange={(e) => handleInputChange(index, "ram", Number(e.target.value))}
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
                <option value="128">128</option>
                <option value="256">256</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg={1}>
            <Form.Group className="mb-3" controlId={`fgQuantity-${index}`}>
              <Form.Control
                size="lg"
                type="text"
                value={row.quantity}
                onChange={(e) => handleInputChange(index, "quantity", Number(e.target.value))}
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
                disabled={true}
                value={row.rate}
                readOnly
                placeholder="Set Rate"
                style={{ fontSize: "16px" }}
              />
            </Form.Group>
          </Col>
          <Col lg={2}>
            <Form.Group className="mb-3" controlId={`fgMonthlyPrice-${index}`}>
              <Form.Control
                size="lg"
                type="text"
                disabled={true}
                value={(row.rate * row.quantity).toFixed(2)}
                readOnly
                placeholder="Monthly Rate"
                style={{ fontSize: "16px" }}
              />
            </Form.Group>
          </Col>
          <Col>
            <Button variant="danger" onClick={() => removeRow(index)}>
              Remove
            </Button>
          </Col>
        </Row>
      ))}
      <Row>
        <Col>
          <Button
            variant="outline-primary"
            onClick={addRow}
            style={{ marginRight: "5px" }}
          >
            Add
          </Button>
        </Col>
        {props.elasticServices.length !== 0 &&
          <Col>
            <span style={{ fontWeight: "bold", float: "right" }}> Total: ${calculateTotalMonthlyPrice()} </span>
          </Col>}
        <Col>
        </Col>
      </Row>
    </React.Fragment>
  );
}
