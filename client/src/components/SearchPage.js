import React from 'react';
import logo from '../logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Navbar, Nav, Modal, Spinner } from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import { Auth } from 'aws-amplify'
import '../style/SearchPage.css';
import { FaSearch, FaHome, FaUserAlt, FaSignOutAlt } from 'react-icons/fa';
import SearchByIngredients from './SearchByIngredients';
import SearchByCuisines from './SearchByCuisines'
import UserPage from './UserPage'


export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //true = search by cuisine, false = search by ingredients
      toggleSearch: true,
      toMain: false
    }
  }

  handleSearchToggle = () => {
    this.setState({ toggleSearch: !this.state.toggleSearch });
  }

  navigateToMain = () => {
    this.setState({ toMain: true });
  }

  /**
   * User Modal
   */
  userModal = () =>{
    return (
      <Modal show={this.state.showUser} onHide={this.handleCloseUserModal}>
        <Modal.Header closeButton>
          <Modal.Title>User</Modal.Title>
        </Modal.Header>
        <UserPage/>
      </Modal>
    )
  }
  signOutModal = () =>{
    return (
      <Modal show={this.state.showSignOut} onHide={this.handleCloseSignOutModal}>
        <Modal.Header closeButton>
          <Modal.Title>Signed out!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Redirecting to main page . . . <Spinner animation="border" /> </Modal.Body>
      </Modal>
    )
  }
  handleShowUserModal = () =>{
    this.setState({ showUser: true });
  }
  handleCloseUserModal = () =>{
    this.setState({ showUser: false });
  }
  handleShowSignOutModal = () =>{
    this.setState({ showSignOut: true });
  }
  handleCloseSignOutModal = () =>{
    this.setState({ showSignOut: false });
  }
  handleLogOut = async () =>{
    try {
      await Auth.signOut();
      this.handleShowSignOutModal();
      setTimeout(this.navigateToMain, 2000);
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  /**
   * Render funtion
   */
  render() {

    if (this.state.toMain === true) {
      return <Redirect to='/Main' />
    }

    return (
      < div className="overall-container">
        <div className="navBar">
          <Navbar bg="transparent" >
            <Navbar.Brand href="/Main" >
              <FaHome />
            </Navbar.Brand>
            <Nav className="mr-auto"> </Nav>
            <Navbar.Brand onClick={this.handleShowUserModal} >
              <FaUserAlt />
            </Navbar.Brand>
            <Navbar.Brand onClick={this.handleLogOut} >
              <FaSignOutAlt />
            </Navbar.Brand>
          </Navbar>
        </div>

        <div className="SearchPage-container">
          <div className="header">
            <img src={logo} className="SearchPage-logo" alt="logo" />
          </div>
          <div className="searchBar-container">
            {this.state.toggleSearch ?
              <div className="rows2">
                <Button variant="secondary" onClick={this.handleSearchToggle}> <FaSearch /> Ingredients</Button>
                <div > &nbsp; &nbsp;</div>
                <Button variant="primary"> <FaSearch /> Cuisines </Button>
              </div>
              :
              <div className="rows2">
                <Button variant="primary"> <FaSearch /> Ingredients</Button>
                <div > &nbsp; &nbsp;</div>
                <Button variant="secondary" onClick={this.handleSearchToggle}> <FaSearch /> Cuisines </Button>
              </div>
            }
            {this.state.toggleSearch ?
              // search by cuisines:
              <SearchByCuisines />
              :
              // search by ingredients: by Zhongyang
              <SearchByIngredients />
            }
          </div>
          <div className="empty"></div>
        </div >
        {this.signOutModal()}
        {this.userModal()}
      </div>
    );
  }
}
