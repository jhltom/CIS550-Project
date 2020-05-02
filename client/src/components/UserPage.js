import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Spinner,
  Form,
  Button,
  Modal,
  Row,
  Col
} from "react-bootstrap";
import { API, Auth } from 'aws-amplify'
import '../style/UserPage.css';

export default class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLogged: false,
      firstName: "",
      lastName: "",
      favoriteCuisines: [],

    }
  }

  componentDidMount = async () => {

    Auth.currentAuthenticatedUser()
      //if logged in already
      .then(async user => {
        this.setState({ userLogged: true });
        const userId = user.username;
        const response = await API.get("cis550proj", `/users/${userId}`);
        console.log("Result: ", response);
        this.setState({
          firstName: response[0].firstName,
          lastName: response[0].lastName,
          favoriteCuisines: response[0].favoriteCuisines
        })

      })
      //if not logged in
      .catch(err => {
        console.log(err)
        this.setState({ userLogged: false });
      })

  }

  render() {

    return (
      <div>
        {this.state.userLogged ?
          <Modal.Body>
            <Form>

              <Form.Group >
                <Form.Label>First name: </Form.Label>
                &nbsp;&nbsp;&nbsp;
                <Form.Label>{this.state.firstName}</Form.Label>
              </Form.Group>


              <Form.Group >
                <Form.Label>Last name: </Form.Label>
                &nbsp;&nbsp;&nbsp;
                <Form.Label>{this.state.lastName}</Form.Label>
              </Form.Group>

              <Form.Group>
                <Form.Label> Favorite Cuisines: </Form.Label>
                {this.state.favoriteCuisines.map((val, i ) =>{
                  return(
                    <Form.Control plaintext readOnly defaultValue={val.label} key={i} />
                  )
                })}
              </Form.Group>

            </Form>
          </Modal.Body>

          :
          <div> No User Logged! </div>
        }
      </div>
    );
  }
}