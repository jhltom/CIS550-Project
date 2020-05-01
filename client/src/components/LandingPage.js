import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Button, Modal, Nav } from 'react-bootstrap';
import { FaHome, FaUserAlt } from 'react-icons/fa';
import '../style/LandingPage.css';
import {Redirect} from 'react-router-dom';
import { Auth } from 'aws-amplify'
import LoginLoadingModal from './LoginLoadingModal'

export default class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toSearch: false,
      showUser: false,
      showLogin: false
    }
  }

  /**
   * Get started functions
   */
  handleGetStarted = () => {
    Auth.currentAuthenticatedUser()
      //if logged in already
      .then(user => {
        console.log({ user })
        this.navigateToSearch();
      })
      //if not logged in
      .catch(err => {
        console.log(err)
        this.handleShowLogin();
      })
  }
  navigateToSearch = () => {
    this.setState({ toSearch: true });
  }

  /**
   * Login Modal functions
   */
  loginModal = () => {
    return (
      <Modal show={this.state.showLogin} onHide={this.handleCloseModal}>
        <Modal.Body>
          <LoginLoadingModal />
        </Modal.Body>
      </Modal>
    )
  }
  handleCloseModal = () => {
    console.log("called")
    this.setState({ showLogin: false });
  }
  handleShowLogin = () => {
    this.setState({ showLogin: true });
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
        <Modal.Body>
          <Button variant="primary" onClick={this.handleLogOut} >Sign out! </Button>
        </Modal.Body>
      </Modal>
    )
  }
  handleShowUserModal = () =>{
    this.setState({ showUser: true });
  }
  handleCloseUserModal = () =>{
    this.setState({ showUser: false });
  }
  handleLogOut = async () =>{
    try {
      await Auth.signOut();
      this.handleCloseUserModal();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
  
  /**
   * Render()
   */
  render() {

    if (this.state.toSearch === true) {
      return <Redirect to='/Search' />
    }

    return (
      <div className="bg">
        <Navbar bg="transparent" >
          <Navbar.Brand href="/Main" >
            <FaHome />
          </Navbar.Brand>
          <Nav className="mr-auto"> </Nav>
          <Navbar.Brand onClick={this.handleShowUserModal} >
            <FaUserAlt />
          </Navbar.Brand>
        </Navbar>

        <div className="LandingPage-container">
          <div className="jumbotron bg-transparent banner">
            <h1>550 WebApp</h1>
            <div className="text">
              Description about the web application comes here.  This is a simple hero unit, a simple jumbotron-style component for calling
              extra attention to featured content or information.
            </div>
            <div className="button"> <Button variant="primary" onClick={this.handleGetStarted}> Get Started! </Button> </div>
          </div>
        </div>

        {/* modals */}
        {this.loginModal()}
        {this.userModal()}
      </div>
    );
  }
}
