import React from 'react';
import logo from '../logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge, Button, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import '../style/SearchPage.css';


export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      //true = search by cuisine, false = search by ingredients
      toggleSearch: true,

      cuisineOptions: [
        { value: 'American', label: 'American' },
        { value: 'Chinese', label: 'Chinese' },
        { value: 'French', label: 'French' },
        { value: 'Indian', label: 'Indian' },
        { value: 'Korean', label: 'Korean' },
        { value: 'Mexican', label: 'Mexican' },
        { value: 'Spanish', label: 'Spanish' },
      ],
      locationOptions: [
        { value: 'PHL', label: 'Greater Phialdelphia Area' },
        { value: 'LA', label: 'Greater Los Angeles Area' },
        { value: 'SF', label: 'San Francisco Bay Area' },
        { value: 'NY', label: 'Greater New York City Area' },
      ],
      selectedCuisines: [],
      selectedLocation: ""
    }
  }

  handleCuisinesChange = (selectedCuisines) => {
    this.setState(
      { selectedCuisines },
      () => console.log(`Option selected:`, this.state.selectedCuisines)
    );
  }
  handleLocationChange = (selectedLocation) => {
    this.setState(
      { selectedLocation },
      () => console.log(`Option selected:`, this.state.selectedLocation)
    );
  }
  handleSearchToggle = () => {
    this.setState({ toggleSearch: !this.state.toggleSearch });
  }





  render() {
    return (
      < div className="SearchPage-container" >
        <div className="header">
          <img src={logo} className="SearchPage-logo" alt="logo" />
        </div>

        <div className="searchBar-container">

          {this.state.toggleSearch ?
            <div className="rows2">
              <Button variant="secondary" onClick={this.handleSearchToggle}>Ingredients</Button>
              <h3 > &nbsp; &nbsp;</h3>
              <Button variant="primary"  >Cuisines </Button>
            </div>
            :
            <div className="rows2">
              <Button variant="primary" >Ingredients</Button>
              <h3 > &nbsp; &nbsp;</h3>
              <Button variant="secondary" onClick={this.handleSearchToggle}>Cuisines </Button>
            </div>
          }

          {this.state.toggleSearch ?

            // search by cuisines:
            <div className="rows">
              <InputGroup.Text id="inputGroupPrepend">Cuisine</InputGroup.Text>
              <Select
                isMulti
                styles={selectStyles}
                value={this.state.selectedCuisines}
                isSearchable
                placeholder="Select cuisine(s) ... "
                size={50}
                options={this.state.cuisineOptions}
                onChange={this.handleCuisinesChange}
              />
              <InputGroup.Text id="inputGroupPrepend">Location</InputGroup.Text>
              <Select
                styles={selectStyles}
                value={this.state.selectedLocation}
                placeholder="Select location ... "
                size={50}
                options={this.state.locationOptions}
                onChange={this.handleLocationChange}
              />
              <Button type="submit">Search</Button>
            </div>

            :

            // search by ingredients: by Zhongyang
            <div className="rows">
            </div>
          
          
          }

        </div>
        <div className="empty"></div>
      </div >
    );
  }
}

// style for React components
const selectStyles = {
  container: base => ({
    ...base,
    flex: 1
  })
};