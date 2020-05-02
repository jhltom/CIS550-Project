import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Button, Modal, Nav, Spinner } from 'react-bootstrap';
import { FaHome, FaUserAlt, FaSignOutAlt } from 'react-icons/fa';
import '../style/LandingPage.css';
import {Redirect} from 'react-router-dom';
import { Auth } from 'aws-amplify'
import LoginLoadingModal from './LoginLoadingModal'
import UserPage from './UserPage'

export default class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toSearch: false,
      // modal toggles:
      showUser: false,
      showLogin: false,
      showSignOut: false
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
        <LoginLoadingModal />
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
        {/* <Modal.Body>Redirecting to main page . . . <Spinner animation="border" /> </Modal.Body> */}
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
          <Navbar.Brand onClick={this.handleLogOut} >
            <FaSignOutAlt />
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
        {this.signOutModal()}
        {this.userModal()}
      </div>
    );
  }
}
