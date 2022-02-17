import React from 'react';
import Link from 'next/link';
import _JSXStyle from 'styled-jsx/style';
import { Jumbotron, Container, Row, Col, Button } from 'reactstrap';

/** import auth service **/
import auth0 from '../services/auth0';

class Login extends React.Component {

  render(){
    return(
        <div className="main-page-login text-center">
          <Jumbotron fluid className="example" style={{ height: '100%', paddingTop: '10rem' }}>
            <Container fluid>
              <h1 className="display-1 mb-3">Task Hero<sup className="beta-tag">(beta)</sup></h1>
              <Button color="primary" size="lg" onClick={() => auth0.login() }>Entrar en la aplicación</Button>
            </Container>
          </Jumbotron>
          <style jsx>{`
            .main-page-login {
              height: 100vh;
              overflow-y: hidden;
            }
            .beta-tag {
              font-size: 40%;
              top: -2.7rem;
            }
        `}</style>
        </div>
    );
  }

}
export default Login
