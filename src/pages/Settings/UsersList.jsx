import React, { useState, useEffect } from "react";
import SlidingPane from "react-sliding-pane";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import "react-sliding-pane/dist/react-sliding-pane.css";

import HttpClient from "../../api/HttpClient";
import SidebarMenu from "../../components/SidebarMenu";
import AppHeader from "../../components/AppHeader";
import CreateUser from "./components/Users/CreateUser";

const UsersList = () => {
  const [usersList, setUsersList] = useState([]);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  useEffect(() => {
    document.title = "Users Manage | Khazana";
    fetchUsersList();
  }, []);

  useEffect(() => {
    console.log(apiError);
  }, [apiError]);

  const fetchUsersList = () => {
    setUsersList([]);
    setLoading(true);

    HttpClient.get("/users/get")
      .then((responsePayload) => {
        let responseData = responsePayload.data;
        setUsersList(responseData.data);
        localStorage.setItem("users", JSON.stringify(responseData.data));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          setApiError(error.response.data.message);
        } else if (error.request) {
          setApiError(error.request);
        } else {
          setApiError(error.message);
        }
      });
  }

  const handleUserListReload = () => {
    fetchUsersList();
  };

  return (
    <Container fluid style={{ paddingRight: "0", paddingLeft: "0" }}>
      <div style={{ display: "flex", height: "100vh" }}>
        <AppHeader
          appTitle="Manage Users"
          sessionUser={undefined}
          source="SystemAdmin"
        />
        <>
          <SidebarMenu sessionUser={undefined} />
          <main style={{ width: "100%", paddingTop: "60px" }}>
            <Row style={{ margin: "0" }}>
              <Col style={{ padding: "20px" }}>
                <Row>
                  <Col>
                    <div style={{ fontSize: "14px", color: "#909090" }}>
                      Settings / Manage Users
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
                      variant="outline-secondary"
                      size="md"
                      onClick={() => setIsSliderOpen(true)}
                      style={{
                        fontSize: "14px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        borderRadius: "20px",
                      }}
                    >
                      Create User
                    </Button>
                    <span style={{ padding: "5px" }}></span>
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
              </Col>
            </Row>

            <Row className="justify-content-md-center">
              <Table striped bordered hover style={{ width: "95%" }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Organization</th>
                    <th>Flags</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    (usersList.length === 0 || loading) &&
                    <tr>
                      <td colSpan={5} className="align-middle text-center">No data found!</td>
                    </tr>
                  }

                  {
                    usersList.length !== 0 && !loading &&
                    usersList.map((user, i) => (
                      <tr key={user.id}>
                        <td className="align-middle">{user.full_name}</td>
                        <td className="align-middle">{user.email}</td>
                        <td className="align-middle">{user.organization}</td>
                        <td className="align-middle">{Object.keys(user.flags).map((key, i) => {
                          return <Form.Check key={i} disabled type='checkbox' id={`default-${i}`} label={key} checked={user.flags[key]} />
                        })}</td>
                        <td className="align-middle">
                          <Button
                            variant="outline-success"
                            size="md"
                            onClick={() => { }}
                          >
                            <i className="las la-edit" style={{ fontSize: "16px" }}></i>{" "}
                            Edit
                          </Button>
                          <span style={{ padding: "5px" }}></span>
                          <Button
                            variant="outline-primary"
                            size="md"
                            onClick={() => { }}
                          >
                            <i className="las la-trash" style={{ fontSize: "16px" }}></i>{" "}
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
            </Row>
          </main>

          <SlidingPane
            className="slider-class"
            overlayClassName="some-custom-overlay-class"
            isOpen={isSliderOpen}
            title="Create User"
            width="80%"
            onRequestClose={() => setIsSliderOpen(false)}
          >
            <CreateUser setSliderState={setIsSliderOpen} />
          </SlidingPane>
        </>
      </div>
    </Container>
  );
};

export default UsersList;
