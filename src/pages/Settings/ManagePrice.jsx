import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import "react-sliding-pane/dist/react-sliding-pane.css";

import HttpClient from "../../api/HttpClient";
import SidebarMenu from "../../components/SidebarMenu";
import AppHeader from "../../components/AppHeader";

const ManagePrice = () => {
  const [unitCostList, setUnitCostList] = useState([]);
  const [sessionUser, setSessionUser] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiSessionError, setApiSessionError] = useState("");
  const [listLoadingSpinner, setListLoadingSpinner] = useState(false);
  const [editedItems, setEditedItems] = useState([]); // Track edited items

  useEffect(() => {
    document.title = "Cost Manage | Khazana";
    getUnitPriceList();
  }, []);

  const getUnitPriceList = () => {
    setUnitCostList([]);
    setListLoadingSpinner(true);

    HttpClient.get("/unit-costs")
      .then((responsePayload) => {
        let responseData = responsePayload.data;
        setUnitCostList(responseData.unit_costs);
        localStorage.setItem("unitCost", JSON.stringify(responseData.unit_costs));
        console.log(responseData);
        setListLoadingSpinner(false);
      })
      .catch((error) => {
        setListLoadingSpinner(false);
        if (error.response) {
          setApiError(
            error.response.data.message +
            "[" +
            error.response.data.message_detail +
            "]"
          );
        } else if (error.request) {
          setApiError(error.request);
        } else {
          setApiError(error.message);
        }
      });
  }

  const handleUserListReload = () => {
    getUnitPriceList();
  };

  const handleInputChange = (index, key, value) => {
    const updatedItem = { ...unitCostList[index], [key]: value };

    // Update the main list
    const updatedList = [...unitCostList];
    updatedList[index] = updatedItem;

    setUnitCostList(updatedList);

    // Track updated items separately
    setEditedItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === updatedItem.id);
      if (existingIndex > -1) {
        prev[existingIndex] = updatedItem;
        return [...prev];
      } else {
        return [...prev, updatedItem];
      }
    });
  };

  const handleUpdatePrices = () => {
    // Example data payload

    setListLoadingSpinner(true);

    HttpClient.post("/unit-costs", editedItems)
      .then((responsePayload) => {
        const responseData = responsePayload.data;
        console.log(responseData);

        if (responseData.updated_count > 0) {
          setUnitCostList((prevList) => {
            // Update the local state with the new data (optional, depends on the use case)
            return prevList.map((item) => {
              const updatedItem = editedItems.find((p) => p.id === item.id);
              return updatedItem ? { ...item, ...updatedItem } : item;
            });
          });
        }

        setListLoadingSpinner(false);
      })
      .catch((error) => {
        setListLoadingSpinner(false);

        if (error.response) {
          setApiError(
            error.response.data.message +
            "[" +
            error.response.data.message_detail +
            "]"
          );
        } else if (error.request) {
          setApiError(error.request);
        } else {
          setApiError(error.message);
        }
      });
  };


  useEffect(() => {
    console.log(editedItems)
  }, [editedItems])

  return (
    <Container fluid style={{ paddingRight: "0", paddingLeft: "0" }}>
      <div style={{ display: "flex", height: "100vh" }}>
        <AppHeader
          appTitle="Manage Users"
          sessionUser={sessionUser}
          source="SystemAdmin"
        />
        {apiSessionError ? (
          <>
            <main
              style={{ width: "100%", paddingTop: "60px", padding: "100px" }}
            >
              <Alert className="form-global-error">{apiSessionError}</Alert>
            </main>
          </>
        ) : (
          <>
            <SidebarMenu sessionUser={sessionUser} />
            <main style={{ width: "100%", paddingTop: "60px" }}>
              <Row style={{ margin: "0" }}>
                <Col style={{ padding: "30px" }}>
                  <Row>
                    <Col>
                      <div style={{ fontSize: "14px", color: "#909090" }}>
                        Settings / Manage Price
                      </div>
                    </Col>
                    <Col style={{ textAlign: "right" }}></Col>
                  </Row>
                  <div className="gutter-10x"></div>
                  <Row>
                    <Col>
                      <div style={{ fontSize: "16px", color: "#909090" }}></div>
                    </Col>
                    <Col style={{ textAlign: "right" }}>
                      <Button
                        variant="outline-primary"
                        size="md"
                        onClick={() => handleUpdatePrices()}
                        style={{
                          fontSize: "14px",
                          paddingLeft: "20px",
                          paddingRight: "20px",
                          borderRadius: "20px",
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="light"
                        size="md"
                        onClick={() => handleUserListReload()}
                        style={{
                          fontSize: "14px",
                          paddingLeft: "20px",
                          paddingRight: "20px",
                          borderRadius: "20px",
                        }}
                      >
                        <i className="las la-sync" style={{ fontSize: "18px" }}></i>{" "}
                        Reload
                      </Button>
                    </Col>
                  </Row>
                  <div className="gutter-20x"></div>
                </Col>
              </Row>
              <Row style={{ padding: 30, paddingTop: 0 }}>
                <Col className="border-1px">Resource Description</Col>
                <Col className="border-1px">
                  Khazana Cost <br /> (Unit Cost (hour) without Margin)
                </Col>
                <Col className="border-1px">
                  Customer Price <br /> (Unit Price (hour) with Margin)
                </Col>
                <Col className="border-1px">Appx Monthly Unit Price</Col>
                <Col className="border-1px">Remarks</Col>
              </Row>

              <div style={{ height: "60vh", overflowY: "auto" }}>
                {unitCostList.length !== 0 &&
                  unitCostList.map((unitPrice, i) => (
                    <Row
                      key={unitPrice.id}
                      style={{ padding: 30, paddingTop: 0, paddingBottom: 0 }}
                    >
                      <Col className="border-1px">
                        <Form.Control
                          type="text"
                          value={unitPrice.resource_desc}
                          onChange={(e) =>
                            handleInputChange(i, "resource_desc", e.target.value)
                          }
                        />
                      </Col>
                      <Col className="border-1px">
                        <Form.Control
                          type="number"
                          value={unitPrice.unit_cost}
                          onChange={(e) =>
                            handleInputChange(i, "unit_cost", e.target.value)
                          }
                        />
                      </Col>
                      <Col className="border-1px">
                        {unitPrice.unit_cost_margin}
                      </Col>
                      <Col className="border-1px">
                        {unitPrice.appx_monthly_cost}
                      </Col>
                      <Col className="border-1px">
                        <Form.Control
                          type="text"
                          value={unitPrice.remarks}
                          onChange={(e) =>
                            handleInputChange(i, "remarks", e.target.value)
                          }
                        />
                      </Col>
                    </Row>
                  ))}
              </div>
            </main>
          </>
        )}
      </div>
    </Container>
  );
};

export default ManagePrice;
