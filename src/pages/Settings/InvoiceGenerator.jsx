import React, { useState, useEffect } from 'react';
import easyinvoice from 'easyinvoice';
import invoice from './Invoice.json'
const InvoiceGenerator = () => {
    const [pdfData, setPdfData] = useState(null); // State to hold the generated PDF data
    const [invoiceData, setInvoiceData] = useState(null);

    useEffect(() => {
        const key = 'invoiceData';
        const data = localStorage.getItem(key); 
        if (data) {
          setInvoiceData(JSON.parse(data)); 
        }
        console.log(data)
      }, []);

    const generateInvoice = async () => {

        // const invoiceData = {
        //     documentTitle: "Tax Invoice",
        //     logo: "https://khazanapk.com/wp-content/uploads/2023/01/KEL-Logo-for-Website-header-02.png", // Add your logo URL
        //     sender: {
        //         company: "Khazana Cloud",
        //         address: "123 Corporate Way",
        //         zip: "90210",
        //         city: "Innovation City",
        //         country: "Techland",
        //         custom1: "Email: info@yourcompany.com",
        //         custom2: "Phone: +1 123 456 7890",
        //     },
        //     client: {
        //         company: "Valued Client",
        //         address: "789 Client Street",
        //         zip: "45678",
        //         city: "Client City",
        //         country: "Client Country",
        //         custom1: "Email: client@example.com",
        //     },
        //     invoiceNumber: "INV-2024-001",
        //     invoiceDate: "2024-11-29",
        //     dueDate: "2024-12-10",
        //     currency: "USD",
        //     taxNotation: "vat",
        //     items: [
        //         {
        //             quantity: 2,
        //             description: "Premium Product",
        //             tax: 5,
        //             price: 150,
        //         },
        //         {
        //             quantity: 1,
        //             description: "Service Package",
        //             tax: 10,
        //             price: 300,
        //         },
        //     ],
        //     bottomNotice: "This invoice was generated with EasyInvoice. Thanks for your business!",
        //     footer: {
        //         text: "Your Cool Company © 2024 - All Rights Reserved",
        //     },
        //     customize: {
        //         background: "#f0f0f0", // Background color
        //         color: "#333333", // Text color
        //         header: { color: "#4CAF50", height: 80 }, // Header styles
        //         footer: { color: "#777777", height: 50 }, // Footer styles
        //     },
        // }

        const invoiceData = invoice


        try {
            const result = await easyinvoice.createInvoice(invoiceData);
            setPdfData(result.pdf); // Set the generated PDF data (base64 string) to state
        } catch (error) {
            console.error("Error generating invoice:", error);
        }
    };

    const downloadInvoice = () => {
        if (pdfData) {
            easyinvoice.download("invoice.pdf", pdfData);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h1>Invoice Generator</h1>
            <button onClick={generateInvoice} style={{ padding: "10px 20px", fontSize: "16px", margin: "10px" }}>
                Generate Invoice
            </button>
            <button
                onClick={downloadInvoice}
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    margin: "10px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                }}
                disabled={!pdfData} // Disable the button if no PDF data is available
            >
                Download Invoice
            </button>
            {pdfData && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Invoice Preview:</h3>
                    <iframe
                        src={`data:application/pdf;base64,${pdfData}`}
                        title="Invoice Preview"
                        width="100%"
                        height="1200px"
                        style={{ border: "1px solid #ddd" }}
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default InvoiceGenerator;
