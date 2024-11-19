
import React, { useState, useEffect, useRef } from 'react'

const ResetPasswordModal = () => {
  const firstRender = useRef(true)
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
  }, [])

  const handleResetPassword = (e) => {
    e.preventDefault()
  }

  // utility functions
  const handleClose = () => {
    props.setShowCopyModel(false)
  }

  return (
    <React.Fragment>
      <Modal show={props.showCopyModel}
        onHide={handleClose}
        animation={false}
        size="md"
        backdrop="static" centered>
        <Modal.Header className='header-content' closeButton>
          <Modal.Title className='modal-title'>
            Reset/Forgot Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='modal-body'>
          {apiError && <Alert className="form-global-error">{apiError}</Alert>}
          <Form onSubmit={handleResetPassword}>

              
            <Button type="submit"
              size="sm"
              className="save-button generic-button2 float-right"
              style={{ lenght: 70 }}
            >
              {
                showSpinner &&
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true" /> Copying...
                </>
              }
              {!showSpinner && "Copy " + props.copyType}
            </Button>
            <span className="float-right">&nbsp;&nbsp;</span>
            <Button
              size="sm"
              className="close-button close-button-effect float-right"
              onClick={handleClose}>
              Close
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  )
}

export default ResetPasswordModal