import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
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
      selectedLocation: "",

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
        <Button type="submit">Search</Button>
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