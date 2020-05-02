import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Redirect
} from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';
import {
  Spinner,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import Select from 'react-select';
import { Hub, API } from 'aws-amplify'
import '../style/LoginLoadingModal.css';


class LoginLoadingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newUser: false,
      userId: "",
      cuisineOptions: [
        { value: 'American', label: 'American' },
        { value: 'Chinese', label: 'Chinese' },
        { value: 'French', label: 'French' },
        { value: 'Indian', label: 'Indian' },
        { value: 'Korean', label: 'Korean' },
        { value: 'Mexican', label: 'Mexican' },
        { value: 'Spanish', label: 'Spanish' },
      ],
      // user info
      selectedCuisines: [],
      lastName: "",
      firstName: ""
    }
  }

  componentDidMount = async () => {
    // add auth listener
    let newUser = false;
    Hub.listen('auth', (data) => {
      const { payload } = data;
      console.log('A new auth event has happened: ', data.payload.data.username + ' has ' + data.payload.event);
      console.log(payload);
      this.setState({userId: data.payload.data.username});
      console.log(this.state.userId)
      
      if (data.payload.event === "signIn") {
        console.log("Signed in!")
        if (!newUser){
          setTimeout(this.navigateToSearch(), 3000);
        }
      }

      if (data.payload.event === "signUp") {
        console.log("New User!")
        newUser=true;
        this.setState({newUser});
      }
    })
  }

  componentWillUnmount = () =>{
    console.log("ummount")
    Hub.remove('auth', (data) => {
      console.log("remove listener", data)
    });
  }

  /**
   * Navigation method
   */
  navigateToSearch = () => {
    this.setState({ toSearch: true });
  }

  /**
   * New User functions
   */
  handleLastName = (event) =>{
    this.setState({lastName: event.target.value});
  }
  handleFirstName = (event) =>{
    this.setState({firstName: event.target.value});
  }
  handleCuisinesChange = (selectedCuisines) => {
    this.setState(
      { selectedCuisines },
      () => console.log(`Option selected:`, this.state.selectedCuisines)
    );
  }
  validateForm = () =>{
    return (
      this.state.lastName.length > 0 &&
      this.state.firstName.length > 0 &&
      this.state.selectedCuisines.length > 0
    )
  }
  handleCreateNewUser = async () => {
    
    console.log('handle');
    await API.post("cis550proj", "/users", {
      body: {
        id: this.state.userId,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        favoriteCuisines: this.state.selectedCuisines
      }
    });
    
    // const response = await API.get("cis550proj", `/users/${this.state.userId}`);
    // console.log("Result: ", response);
    alert(`New user successfully created! ${this.state.lastName} ${this.state.firstName}`);
    setTimeout(this.navigateToSearch(), 3000);
  }

  /**
   * Render funtion
   */
  render() {
    if (this.state.toSearch === true) {
      return <Redirect to='/Search' />
    }

    return (
      <div>
        {this.state.newUser ?
          <div>
            <Modal.Header>
              <Modal.Title> Basic Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter last name" value={this.state.lastName} onChange ={this.handleLastName}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter first name" value={this.state.firstName} onChange ={this.handleFirstName}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Favorite Cuisines</Form.Label>
                  <Select
                    isMulti
                    // styles={selectStyles}
                    value={this.state.selectedCuisines}
                    isSearchable
                    placeholder="Select cuisine(s) ... "
                    size={50}
                    options={this.state.cuisineOptions}
                    onChange={this.handleCuisinesChange}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type="submit" disabled={!this.validateForm()} onClick={this.handleCreateNewUser}>Submit</Button>
            </Modal.Footer>
          </div>
          :
          <Spinner animation="border" />}
      </div>
    );
  }
}


export default withAuthenticator(LoginLoadingModal, false)