import React from 'react';
import _JSXStyle from 'styled-jsx/style';
import { Modal, ModalBody, Container, Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

class SelectedDateErrorModal extends React.Component {

  render(){
    const { isOpen } = this.props;
    return (
    <div>
      <Modal isOpen={isOpen}>
        <ModalBody>
          <Container>
            <Row className="text-center text-danger">
              <Col>
                <FontAwesomeIcon icon={faExclamationCircle} style={{ fontSize: '50px' }} />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                La fecha seleccionada se solapa con la fecha de alguna de tus otras listas, por favor,
                selecciona un rango de fechas en el que no tengas otra lista de tareas.
              </Col>
            </Row>
            <Row className="mt-4 mb-1">
              <Col xs={{ size: 8, offset: 2 }}>
                <Button color="primary" onClick={() => this.props.close()} block>Volver a la lista de tareas</Button>
              </Col>
            </Row>
          </Container>
        </ModalBody>
      </Modal>
      <style jsx>{`
        .user-category-row {
          display: -ms-flexbox;
          display: flex;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
  }
}

export default SelectedDateErrorModal;
