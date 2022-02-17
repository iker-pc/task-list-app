import React from 'react'
import _JSXStyle from 'styled-jsx/style';
import { connect } from 'react-redux';
import { Navbar, Nav, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, NavbarText, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';

/** import auth service **/
import auth0 from '../services/auth0';

class MainHeader extends React.Component {

  render(){
    const { authInfo, updatingDataLoading, updatingDataDate } = this.props;
    return(
      <div className="mainNavBar">
        <Navbar expand="md">
          <FontAwesomeIcon className="main-logo" icon={faListAlt} />&nbsp;&nbsp;
          <span className="main-logo-text">TaskHero</span>
          <NavbarText className="ml-auto mr-5 text-white">
            { updatingDataLoading
                ? 'Saving data...'
                : updatingDataDate
                  && `Last update: ${updatingDataDate.toLocaleTimeString('en')}`
            }
                &nbsp;
            { updatingDataLoading && <Spinner size="sm" color="light" /> }
          </NavbarText>
          <Nav className="ml" navbar>
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav>
                  <span className="text-white mr-2">{authInfo.name}</span>
                  <img className="img-profile" width="50" height ="50" src={authInfo.picture}/>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={() => auth0.clientLogout()}>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Navbar>
          <style jsx global>{`
            .mainNavBar {
              background-color: #858796;
            }
            .main-logo{
              font-size: 30px;
              color: white;
              margin-left: 15px;
            }
            .main-logo-text {
              font-size: 25px;
              font-weight: bold;
              color: white;
            }
            .img-profile{
              border-radius: 50%;
              height: 2.5rem;
              width: 2.5rem;
            }
            .nav-link {
              padding: 0px !important;
            }
        `}</style>
      </div>
    )
  }
}

const mapStateToProps = state => ({
    updatingDataLoading: state.misc.loading,
    updatingDataDate: state.misc.lastUpdatedDate,
});

export default connect(mapStateToProps)(MainHeader);
