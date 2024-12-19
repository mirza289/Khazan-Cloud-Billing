import React, { useState } from 'react';
import { Container, Row, Col, Table, Button, Form, Image } from 'react-bootstrap';
import generatePDF, { Options } from 'react-to-pdf';
import 'bootstrap/dist/css/bootstrap.min.css';

const options = {
  filename: 'invoice.pdf',
  page: {
    margin: 20,
  },
}

function InvoiceGenerator() {
  const [items, setItems] = useState([
    { description: 'Brochure Design', quantity: 2, rate: 100, amount: 200 },
  ]);
  const [taxRate, setTaxRate] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('It was great doing business with you.');
  const [terms, setTerms] = useState('Please make the payment by the due date.');

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    if (field === 'quantity' || field === 'rate') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
    }
    setItems(updatedItems);
  };

  const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = (subTotal * discount) / 100;
  const taxableAmount = subTotal - discountAmount;
  const tax = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + tax;

  const getTargetElement = () => document.getElementById('invoice-container');

  const downloadPdf = () => generatePDF(getTargetElement, options);

  return (
    <Container>
      <Row className="my-4">
        <Col md={12} className="text-end">
          <Button variant="primary" onClick={downloadPdf}>Download PDF</Button>
        </Col>
      </Row>
      <div id="invoice-container">
        <Row className="my-4">
          <Col md={6}>
            <Image src="/KEL-Logo-for-Website-header-02.png" style={{height:250}} alt="Company Logo" className="mb-3" />
            <h5>Your Company</h5>
            <p>Your Name</p>
            <p>Company's Address</p>
            <p>City, State Zip</p>
            <p>Pakistan</p>
          </Col>
          <Col md={6} className="text-end">
            <div className='gutter-40x'></div>
            <div className='gutter-20x'></div>
            <h1>INVOICE</h1>
            <p><strong>Invoice#:</strong> INV-12</p>
            <p><strong>Invoice Date:</strong> Dec 19, 2024</p>
            <p><strong>Due Date:</strong> Jan 18, 2025</p>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <h6>Bill To:</h6>
            <p>Your Client's Name</p>
            <p>Client's Address</p>
            <p>City, State Zip</p>
            <p>United States</p>
          </Col>
        </Row>
        <Table striped bordered hover className="my-4">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <Form.Control
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                  />
                </td>
                <td>{item.amount.toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} className="text-center">
                <Button variant="success" onClick={handleAddItem}>Add Line Item</Button>
              </td>
            </tr>
          </tbody>
        </Table>
        <Row>
          <Col md={{ span: 4, offset: 8 }}>
            <Table bordered>
              <tbody>
                <tr>
                  <td>Sub Total</td>
                  <td>{subTotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Discount (%)</td>
                  <td>
                    <Form.Control
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Sale Tax ({taxRate}%)</td>
                  <td>{tax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>TOTAL</strong></td>
                  <td><strong>{total.toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="my-4">
          <Col>
            <h6>Notes</h6>
            <Form.Control
              as="textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="my-4">
          <Col>
            <h6>Terms & Conditions</h6>
            <Form.Control
              as="textarea"
              rows={3}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            />
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default InvoiceGenerator
