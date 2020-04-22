import React from 'react';
import '../style/Feature2.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import PageNavbar from './PageNavbar';

export default class Feature2 extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      cuisineOptions: [
        { value: 'American', label: 'American' },
        { value: 'Chinese', label: 'Chinese' },
        { value: 'French', label: 'French' },
        { value: 'Indian', label: 'Indian' },
        { value: 'Korean', label: 'Korean' },
        { value: 'Mexican', label: 'Mexican' },
        { value: 'Spanish', label: 'Spanish' },
      ],
      selectedCuisine: [],
      selectedCuisineDivs: [],
    }
  }

  componentDidMount = () => {

    // TODO: get of all cuisine types from CuisineType db

    // For now for testing purposes: 
    let selectedCuisineDivs = [
      <div className="restaurant">
        <div className="restaurantName">Tom's Restaurant</div>
        <div className="cuisineType">Korean, Mexican, Spanish</div>
        <div className="address">310 S. 36th Street</div>
        <div className="open">Open</div>
      </div>];
    this.setState({ selectedCuisineDivs });

  }

  handleChange = selectedCuisine => {
    this.setState(
      { selectedCuisine },
      () => console.log(`Option selected:`, this.state.selectedCuisine)
    );

    //TODO: create selectedCuisineDivs for selectedCuisine (handleOpenHours)

  };

  handleOpenHours = () =>{
    // TODO: determine whether each restaurant is open at a given time

  }


  render() {
    return (
      <div className="Feature2">
        <PageNavbar active="Feature2" />
        <div className="container">

          <Select
            value={this.state.selectedCuisine}
            onChange={this.handleChange}
            options={this.state.cuisineOptions}
            isMulti
            isSearchable
            placeholder="Select cuisine(s) ... "
          />

          <div className="header-container">
            <div className="headers">
              <div className="header"><strong>Retaurant</strong></div>
              <div className="header"><strong>Cuisine Type</strong></div>
              <div className="header"><strong>Address</strong></div>
              <div className="header"><strong>Open/Closed</strong></div>
            </div>
          </div>

          <div className="results-container" id="results">
            {this.state.selectedCuisineDivs}
          </div>

        </div>
      </div>
    );
  }
}