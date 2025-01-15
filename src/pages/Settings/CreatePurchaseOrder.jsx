import React, { useState, useEffect } from 'react'
import { Container, Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
//
import HttpClient from '../../api/HttpClient'
import { toast } from 'react-toastify'
import ElasticService from './components/Services/ElasticService'
import StorageService from './components/Services/StorageService'
import DrService from './components/Services/DrService'
import ContainerService from './components/Services/ContainerService'
import ContainerServiceWK from './components/Services/ContainerServiceWK'
import SecurityService from './components/Services/SecurityService'
import DatabaseService from './components/Services/DatabaseService'
import NetworkService from './components/Services/NetworkService'
import ValueAddedService from './components/Services/ValueAddedService'


const CreatePurchaseOrder = (props) => {
  const [userId, setUserId] = useState(0);
  const [apiError, setApiError] = useState('');
  const [newPo, setNewPo] = useState(false);
  // services data state
  const [elasticServices, setElasticServices] = useState([]);
  const [storageService, setStorageService] = useState([]);
  const [drServices, setDrServices] = useState([]);
  const [containerServices, setContainerServices] = useState([]);
  const [containerSpecialServices, setContainerSpecialServices] = useState([]);
  const [securityServices, setSecurityServices] = useState([]);
  const [databaseServices, setDatabaseServices] = useState([]);
  const [networkServices, setNetworkServices] = useState([]);
  const [additionalServices, setAdditionalServices] = useState({
    serviceName: "valueAddedServices",
    data: [], // Array to hold selected services with price and qty
  });

  useEffect(() => {
    console.log("User ID: ", props.userId);
    setUserId(props.userId);
    HttpClient.get('po/get/' + props.userId)
      .then(responsePayload => {
        let response = responsePayload.data.data;

        if (response.services.length === 0) {
          setNewPo(true);
          return;
        }

        for (let index = 0; index < response.services.length; index++) {
          if (response.services[index].serviceName === 'elasticService')
            setElasticServices(response.services[index].data);

          if (response.services[index].serviceName === 'storageService')
            setStorageService(response.services[index].data);

          if (response.services[index].serviceName === 'drService')
            setDrServices(response.services[index].data);

          if (response.services[index].serviceName === 'containerServices')
            setContainerServices(response.services[index].data);

          if (response.services[index].serviceName === 'containerServiceWorker')
            setContainerSpecialServices(response.services[index].data);

          if (response.services[index].serviceName === 'securityServices')
            setSecurityServices(response.services[index].data);

          if (response.services[index].serviceName === 'databaseServices')
            setDatabaseServices(response.services[index].data);

          if (response.services[index].serviceName === 'networkServices')
            setNetworkServices(response.services[index].data);

          if (response.services[index].serviceName === 'valueAddedServices') {
            setAdditionalServices({
              serviceName: "valueAddedServices",
              data: response.services[index].data
            });
          }
        }
      })
      .catch(error => {
        if (error.response) {
          setApiError(error.response.data.message);
        } else if (error.request) {
          setApiError(error.request);
        } else {
          setApiError(error.message);
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // handle create user
  const handlePurchaseOrder = (e) => {
    e.preventDefault();
    setApiError('');

    if (
      elasticServices.length === 0 &&
      storageService.length === 0 &&
      drServices.length === 0 &&
      containerServices.length === 0 &&
      containerSpecialServices.length === 0 &&
      securityServices.length === 0 &&
      databaseServices.length === 0 &&
      networkServices.length === 0 &&
      additionalServices.data.length === 0
    ) {
      toast.error("Please add at least one service");
      return;
    }

    let services = [];

    if (elasticServices.length > 0) {
      services.push({
        'serviceName': "elasticService",
        'data': elasticServices
      });
    }
    if (storageService.length > 0) {
      services.push({
        'serviceName': "storageService",
        'data': storageService
      });
    }
    if (drServices.length > 0) {
      services.push({
        'serviceName': "drService",
        'data': drServices
      })
    }
    if (containerServices.length > 0) {
      services.push({
        'serviceName': "containerServices",
        'data': containerServices
      })
    }
    if (containerSpecialServices.length > 0) {
      services.push({
        'serviceName': "containerServiceWorker",
        'data': containerSpecialServices
      })
    }
    if (securityServices.length > 0) {
      services.push({
        'serviceName': "securityServices",
        'data': securityServices
      })
    }
    if (databaseServices.length > 0) {
      services.push({
        'serviceName': "databaseServices",
        'data': databaseServices
      })
    }
    if (networkServices.length > 0) {
      services.push({
        'serviceName': "networkServices",
        'data': networkServices
      })
    }
    if (additionalServices.data.length > 0) {
      services.push(additionalServices);
    }

    let UserPurchaseOrder = {
      "userId": userId,
      "services": services,
    }

    HttpClient.post(
      '/po/' + (newPo ? 'create' : 'update'),
      UserPurchaseOrder // data
    ).then(responsePayload => {
      toast.success("PO recorded successfully");
      console.log(responsePayload);
      props.setReload((prev) => !prev);
    }).catch(error => {
      if (error.response) {
        setApiError(error.response.data.message);
      } else if (error.request) {
        setApiError(error.request);
      } else {
        setApiError(error.message);
      }
    })
  }

  return (
    <Container fluid style={{ paddingRight: "0", paddingLeft: "0" }}>
      {
        apiError &&
        <>
          <div className="gutter-10x"></div>
          <Alert className="form-global-error">{apiError}</Alert>
          <div className="gutter-10x"></div>
        </>
      }
      <Form onSubmit={handlePurchaseOrder}>

        {/* -----------------------------------------------------Elastic Cloud Server--------------------------------------------------------*/}

        <ElasticService
          elasticServices={elasticServices}
          setElasticServices={setElasticServices}
        />

        {/* --------------------------------------------------------Storage Services---------------------------------------------------------*/}

        <StorageService
          storageService={storageService}
          setStorageService={setStorageService}
        />
        {/* --------------------------------------------------------DR Services---------------------------------------------------------*/}

        <DrService
          drServices={drServices}
          setDrServices={setDrServices}
        />

        {/* --------------------------------------------------------Container Services---------------------------------------------------------*/}

        <ContainerService
          containerServices={containerServices}
          setContainerServices={setContainerServices}
        />

        {/* --------------------------------------------------------Container Services (Worker Nodes Details) ---------------------------------------------------------*/}

        <ContainerServiceWK
          containerSpecialServices={containerSpecialServices}
          setContainerSpecialServices={setContainerSpecialServices}
        />

        {/* -------------------------------------------------------- Security and Protection Services ---------------------------------------------------------*/}

        <SecurityService
          securityServices={securityServices}
          setSecurityServices={setSecurityServices}
        />

        {/* -------------------------------------------------------- Database Services ---------------------------------------------------------*/}

        <DatabaseService
          databaseServices={databaseServices}
          setDatabaseServices={setDatabaseServices}
        />

        {/* -------------------------------------------------------- Network Services ---------------------------------------------------------*/}

        <NetworkService
          networkServices={networkServices}
          setNetworkServices={setNetworkServices}
        />

        {/* -------------------------------------------------------- Value Added Services ---------------------------------------------------------*/}

        <ValueAddedService
          additionalServices={additionalServices}
          setAdditionalServices={setAdditionalServices}
        />

        <div className="d-grid gap-2">
          <Button size="lg" type="submit" style={{ fontSize: "16px", borderRadius: "20px", backgroundColor: "#2887d4" }}>
            {newPo ? (<div>Create</div>) : (<div>Update</div>)}
          </Button>
        </div>

      </Form>
    </Container>
  )
}

export default CreatePurchaseOrder
