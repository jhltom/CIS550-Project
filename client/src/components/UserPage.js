import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Auth } from 'aws-amplify'
import { Spinner } from 'react-bootstrap';
import '../style/UserPage.css';

export default class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLogged: false

    }
  }

  componentDidMount = async () => {

    Auth.currentAuthenticatedUser()
      //if logged in already
      .then(user => {
        console.log({ user })
        this.setState({ userLogged: true });
      })
      //if not logged in
      .catch(err => {
        console.log(err)
        this.setState({ userLogged: false });
      })

  }

  render() {

    return (
      <div className="container-user">
        {this.state.userLogged ?
          <div> User Logged in! </div>
          :
          <div> No User Logged! </div>
        }
      </div>
    );
  }
}