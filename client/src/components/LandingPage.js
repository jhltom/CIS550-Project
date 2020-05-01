import React from 'react';
import logo from '../logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Button, Nav } from 'react-bootstrap';
import { FaHome } from 'react-icons/fa';
import '../style/LandingPage.css';



export default class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div className="bg">

        <Navbar bg="transparent" >
          <Navbar.Brand href="/Main">
            {/* <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '} */}
            <FaHome />
          </Navbar.Brand>
        </Navbar>

        <div className="LandingPage-container">
          <div className="jumbotron bg-transparent banner">
            <h1>550 WebApp</h1>
            <div className="text">
              Description about the web application comes here.  This is a simple hero unit, a simple jumbotron-style component for calling
              extra attention to featured content or information.
            </div> 
            <div className="button"> <Button variant="primary" href="/Search"> Get Started! </Button> </div>
          </div>
        </div>

      </div>
    );
  }
}
