import React from 'react';
import Link from 'next/link';
import _JSXStyle from 'styled-jsx/style';
import { withRouter } from 'next/router';
import { Jumbotron, Container, Spinner } from 'reactstrap';

/** import auth service **/
import auth0Client from '../services/auth0';

class LoginCallback extends React.Component {

  async componentDidMount(){
    await auth0Client.handleAuthetication();
    this.props.router.push('/tasks-lists');
  }

  render(){
    return(
      <div className="main-page-login text-center">
        <Jumbotron fluid className="example" style={{ height: '100%', paddingTop: '13rem' }}>
          <Container fluid>
              <Spinner style={{ width: '7rem', height: '7rem' }} />
          </Container>
        </Jumbotron>
        <style jsx>{`
          .main-page-login {
            height: 100vh;
            overflow-y: hidden;
          }
      `}</style>
      </div>
    );
  }

}
export default withRouter(LoginCallback);
