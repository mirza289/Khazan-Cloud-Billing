import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Form, Image, ToggleButton } from 'react-bootstrap';
import generatePDF, { Options } from 'react-to-pdf';
import 'bootstrap/dist/css/bootstrap.min.css';

const options = {
  filename: 'invoice.pdf',
  page: {
    margin: 20,
  },
};

function InvoiceGenerator() {
  const [items, setItems] = useState([]);
  const [taxRate, setTaxRate] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('It was great doing business with you.');
  const [terms, setTerms] = useState('Prices are inclusive of taxes. Income tax deduction certificate to be shared within 7 days of payment.');
  const [showActions, setShowActions] = useState(false); // Toggle state
  const [invoiceDate] = useState(new Date().toLocaleDateString('en-GB')); // Get current date in dd/mm/yyyy format
  const [dueDate, setDueDate] = useState('');
  const storedData = JSON.parse(localStorage.getItem('serviceCostsSummary')) || [];
  const [dollarRate, setDollarRate] = useState(0); // State for dollar rate
  const [dueDateError, setDueDateError] = useState(''); // State to store validation error

  const handleDueDateChange = (date) => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in 'yyyy-mm-dd' format
    if (date < today) {
      setDueDateError('Due date cannot be in the past.');
    } else {
      setDueDateError('');
      setDueDate(date);
    }
  };
  const companyInfo = {
    name: 'KHAZANA ENTERPRISE (PVT.) LTD',
    ntn: '6672323',
    accountTitle: 'KHAZANA ENTERPRISE (PVT.) LTD',
    bankName: 'FAYSAL BANK LIMITED',
    branchAddress: 'SHADMAN TOWN BRANCH, LAHORE.',
    accountNumber: '0178007900234977',
    iban: 'PK 52 FAYS 0178007900234977',
    swiftCode: 'FAYSPKKA',
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', rate: 0, amount: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    if (field === 'rate') {
      updatedItems[index].amount = Number(updatedItems[index].rate);
    }
    setItems(updatedItems);
  }

  const [priceInPKR, setPriceInPKR] = useState(0); // State to store PKR value
  const subTotal = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const discountAmount = (subTotal * discount) / 100;
  const taxableAmount = subTotal - discountAmount;
  const total = taxableAmount;
  const tax = (priceInPKR * taxRate) / 100;

  const getTargetElement = () => document.getElementById('invoice-container');

  const downloadPdf = () => generatePDF(getTargetElement, options);

  useEffect(() => {
    // Load dynamic data into items on component mount
    const mappedItems = storedData.map(service => ({
      description: service.serviceName,
      rate: parseFloat(service.totalCost) || 0,
      amount: parseFloat(service.totalCost) || 0,
    }));
    setItems(mappedItems);
  }, []);

  const totalInPKR = total * dollarRate; // Calculating total in PKR

  // Calculate PKR value including sales tax
  useEffect(() => {
    if (dollarRate > 0) {
      const convertedPrice = total * dollarRate; // Convert total to PKR
      const taxOnPKR = (convertedPrice * taxRate) / 100; // Apply sales tax
      setPriceInPKR(convertedPrice + taxOnPKR); // Update PKR value
    }
  }, [dollarRate, total, taxRate]);


  return (
    <Container>
      <Row className="my-4">
        <Col md={8}>
          <ToggleButton
            id="toggle-show-actions"
            type="checkbox"
            variant="outline-secondary"
            checked={showActions}
            value="1"
            onChange={(e) => setShowActions(e.currentTarget.checked)}
          >
            {showActions ? 'Hide Add Items & Actions' : 'Show Add Items & Actions'}
          </ToggleButton>
        </Col>
        <Col md={4} className="text-end">
          <Button variant="primary" onClick={downloadPdf}>Download PDF</Button>
        </Col>
      </Row>
      <div id="invoice-container">
        <Row className="my-4">
          <Col md={6}>
            <Image src="/KEL-Logo-for-Website-header-02.png" style={{ height: 250 }} alt="Company Logo" className="mb-3" />
            <h5>KHAZANA ENTERPRISE (PVT) LIMITED</h5>
            <p>NTC Building, Ground Floor <br />
              6 - Race Course Road, Lahore</p>
            <p>Lahore, 54000</p>
            <p>Pakistan</p>
          </Col>
          <Col md={6} className="text-end">
            <h1>INVOICE</h1>
            <p><strong>Invoice#:</strong> INV-12</p>
            <p><strong>NTN#:6672323-2</strong></p>
            <p><strong>Invoice Date:</strong> {invoiceDate}</p>
            <p>
              <strong>Due Date:</strong>{' '}
              <Form.Control
                type="date"
                value={dueDate}
                onChange={(e) => handleDueDateChange(e.target.value)}
                style={{ display: 'inline', width: 'auto' }}
              />
              {dueDateError && (
                <p style={{ color: 'red', fontSize: 'small' }}>{dueDateError}</p>
              )}
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <h6>Bill To: </h6>
            <p>RAQAMI ISLAMIC DIGITAL BANK LIMITED </p>
            <p>4th Floor, Block ‘C’, Finance and Trade Centre, Shahrah-e-Faisal,
              Karachi</p>
            <p>Pakistan</p>
          </Col>
        </Row>
        <Table striped bordered hover className="my-4">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Price</th>
              <th>Amount</th>
              {showActions && <th>Actions</th>}
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
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                  />
                </td>
                <td>{item.amount.toFixed(2)}</td>
                {showActions && (
                  <td>
                    <Button variant="danger" onClick={() => handleRemoveItem(index)}>Remove</Button>
                  </td>
                )}
              </tr>
            ))}
            {showActions && (
              <tr>
                <td colSpan={4} className="text-center">
                  <Button variant="success" onClick={handleAddItem}>Add Line Item</Button>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <Row>
          <Col md={{ span: 6, offset: 6 }}>
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
                  <td><strong>TOTAL (USD)</strong></td>
                  <td><strong>{total.toFixed(2)}</strong></td>
                </tr>
                <tr>
                  <td>
                    Dollar Rate (PKR)
                    <Form.Control
                      type="number"
                      value={dollarRate}
                      onChange={(e) => setDollarRate(Number(e.target.value))}
                      style={{ display: 'inline', width: 'auto', marginLeft: '10px' }}
                    />
                  </td>
                  <td>

                  </td>
                </tr>
                <tr>
                  <td><strong>TOTAL (PKR) (excluding Tax)</strong></td>
                  <td><strong>{totalInPKR.toFixed(2)}</strong></td>
                </tr>
                <tr>
                  <td>
                    Sale Tax (%)
                    <Form.Control
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      style={{ display: 'inline', width: 'auto', marginLeft: '10px' }}
                    />
                  </td>
                  <td>{tax.toFixed(2)}</td>
                </tr>
                {/* <tr>
                  <td><strong>TOTAL (PKR)</strong></td>
                  <td><strong>{dollarRate > 0 ? totalInPKR.toFixed(2) : 'Enter Dollar Rate'}</strong></td>
                </tr> */}
                <tr>
                  <td><strong>Price in PKR (Including Tax)</strong></td>
                  <td><strong>{priceInPKR.toFixed(2)}</strong></td>
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
              rows={14}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            />
          </Col>
          <Col>
            <strong><h6>Company Information</h6></strong>
            <div style={{ padding: "10px", border: "1px solid #dfdfdf" }}>
              <p><strong>{companyInfo.name}</strong></p>
              <p>NTN: {companyInfo.ntn}</p>
              <p>Account Title: {companyInfo.accountTitle}</p>
              <p>Bank Name: {companyInfo.bankName}</p>
              <p>Branch Address: {companyInfo.branchAddress}</p>
              <p>Account Number: {companyInfo.accountNumber}</p>
              <p>IBAN: {companyInfo.iban}</p>
              <p>SWIFT Code: {companyInfo.swiftCode}</p>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default InvoiceGenerator;
