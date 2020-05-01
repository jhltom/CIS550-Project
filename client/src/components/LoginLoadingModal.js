import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
	Redirect
} from 'react-router-dom';
import { withAuthenticator, AmplifySignOut,  } from '@aws-amplify/ui-react';
import { Spinner } from 'react-bootstrap';
import { Hub } from 'aws-amplify'
import '../style/LoginLoadingModal.css';


class LoginLoadingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount = async() => {

    // add auth listener
      Hub.listen('auth', (data) => {

        const { payload } = data;         
        console.log('A new auth event has happened: ', data.payload.data.username + ' has ' + data.payload.event);
        if (data.payload.event === "signIn"){
          console.log("Signed in!")

          //remove auth listener
          Hub.remove('auth', (data) => {
            console.log("remove listener", data)
          } );

          setTimeout(this.navigateToSearch(), 3000);
        } 
    })
    
  }

  
  navigateToSearch = () =>{
    this.setState({toSearch: true});
  }
    
  

  render() {
    if (this.state.toSearch === true) {
      return <Redirect to='/Search' />
    }

    return (
      <div className="container-loading">
        <Spinner animation="border" />
      </div>
    );
  }
}

export default withAuthenticator(LoginLoadingModal, false)