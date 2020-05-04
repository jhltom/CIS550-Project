import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Spinner,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import Select from 'react-select';
import { API, Auth } from 'aws-amplify'
import '../style/UserPage.css';

export default class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLogged: false,
      userId: "",
      firstName: "",
      lastName: "",
      favoriteCuisines: [],
      loading: true,
      updated: false
    }
  }

  componentDidMount = async () => {

    Auth.currentAuthenticatedUser()
      //if logged in already
      .then(async user => {
        this.setState({ userLogged: true });
        const userId = user.username;
        console.log(userId)
        this.setState({userId});
        const response = await API.get("cis550proj", `/users/${userId}`);
        console.log("Result: ", response);
        this.setState({
          firstName: response[0].firstName,
          lastName: response[0].lastName,
          favoriteCuisines: response[0].favoriteCuisines
        }, () => this.setState({ loading: false }));

        await this.getCuisineTypes();

      })
      //if not logged in
      .catch(err => {
        console.log(err)
        this.setState({ userLogged: false });
      })

  }

  getCuisineTypes = async () => {
    await fetch("http://localhost:8081/cuisineTypesFull/",
      {
        method: 'GET'
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(result => {
        console.log(result)
        let cuisineOptions = result.data.map((row, i) => {
          const cuisineType = row.CUISINE;
          const cuisineId = row.CUISINEID;
          return ({
            value: cuisineId,
            label: cuisineType
          })
        });
        cuisineOptions.sort((x, y) => {
          const X = x.label.toUpperCase();
          const Y = y.label.toUpperCase();
          return X < Y ? -1 : X > Y ? 1 : 0;
        });
        this.setState({ cuisineOptions });
      }, err => {
        console.log(err);
      });
  }

  handleCuisinesChange = (favoriteCuisines) => {
    this.setState(
      { favoriteCuisines },
      () => console.log(`Option selected:`, this.state.favoriteCuisines)
    );
  }
  updateCuisines = async() =>{
    console.log("update called: ",this.state.userId)
    await API.post("cis550proj", "/users", {
      body: {
        id: this.state.userId,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        favoriteCuisines: this.state.favoriteCuisines
      }
    });
    this.setState({updated: true})
  }

  render() {

    return (
      <div className="container-user">
        {this.state.userLogged ?
          <div>
            {this.state.loading ?
              <div >
                <Spinner animation="border" />
              </div>
              :

              <div>
                <Modal.Body>
                  <Form>
                    <Form.Group>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter last name" value={this.state.lastName} />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter first name" value={this.state.firstName} />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Favorite Cuisines</Form.Label>
                      <Select
                        isMulti
                        value={this.state.favoriteCuisines}
                        isSearchable
                        placeholder="Select cuisine(s) ... "
                        size={50}
                        options={this.state.cuisineOptions}
                        onChange={this.handleCuisinesChange}
                      />
                    </Form.Group>
                    {this.state.updated? <div> Updated Successfully! </div> : <div></div>}
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={this.updateCuisines}>Update</Button>
                </Modal.Footer>
              </div>

            }

          </div>

          :
          <div> No User Logged! </div>
        }
      </div>
    );
  }
}