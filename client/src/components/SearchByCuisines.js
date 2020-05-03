import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import { Link } from "react-router-dom";
import '../style/SearchPage.css';
import { TiHeartFullOutline, TiLocation } from "react-icons/ti";

export default class SearchByCuisines extends React.Component {
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
      locationOptions: [
        { value: 'PHL', label: 'Greater Phialdelphia Area' },
        { value: 'LA', label: 'Greater Los Angeles Area' },
        { value: 'SF', label: 'San Francisco Bay Area' },
        { value: 'NY', label: 'Greater New York City Area' },
      ],
      selectedCuisines: [],
      _selectedCuisines: [],
      selectedLocation: null,
      _selectedLocation: "",

    }
  }

  handleCuisinesChange = (selectedCuisines) => {
    let _selectedCuisines = [];
    selectedCuisines.map((element) =>{
      _selectedCuisines.push(element.value);
    })
    this.setState({selectedCuisines, _selectedCuisines});
  }
  handleLocationChange = (selectedLocation) => {
    this.setState({selectedLocation, _selectedLocation: selectedLocation.value});
  }
  handleSearchToggle = () => {
    this.setState({ toggleSearch: !this.state.toggleSearch });
  }
  validateSearch = () => {
    return (
      this.state._selectedLocation.length > 0 &&
      this.state.selectedCuisines.length > 0
    )
  }

  render() {
    return (
      <div className="rows">
        <InputGroup.Text id="inputGroupPrepend"> <TiHeartFullOutline /> </InputGroup.Text>
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
        <div > &nbsp; &nbsp;</div>
        <InputGroup.Text id="inputGroupPrepend"> <TiLocation /> </InputGroup.Text>
        <Select
          styles={selectStyles}
          value={this.state.selectedLocation}
          placeholder="Select location ... "
          size={50}
          options={this.state.locationOptions}
          onChange={this.handleLocationChange}
        />
        <div > &nbsp; &nbsp;</div>
        <Link
          to={{
            pathname: `/Feature3`,
            state: {// place data you want to send here!
              selectedLocation: this.state._selectedLocation,
              selectedCuisines: this.state._selectedCuisines
            } 
          }}><Button type="submit" disabled={!this.validateSearch()} > Submit </Button> 
        </Link>
      </div>
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