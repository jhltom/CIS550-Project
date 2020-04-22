import React from 'react';
import PageNavbar from './PageNavbar';
import logo from '../logo.svg';


export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ingredients:[],
      cuisines:[]
    }

    this.showCuisines = this.showCuisines.bind(this);
  }

  // function called when the page load.


  render() {
    return (

      <div className="App">
        <PageNavbar active="Home" />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Coming soon...
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
        </a>
        </header>
      </div>
    );
  }
}