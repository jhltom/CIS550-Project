import React from 'react';
import logo from '../logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge, Button, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import '../style/SearchPage.css';
import { FaSearch } from 'react-icons/fa';
import { TiHeartFullOutline, TiLocation } from "react-icons/ti";


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
      selectedLocation: "",

      ingredientOptions: [
        { value: 'milk', label: 'milk'},
        { value: 'flower', label: 'flower'},
        { value: 'peach', label: 'peach'},
        { value: 'loach', label: 'loach'},
        { value: 'black bass', label: 'black bass'},
        { value: 'curry', label: 'curry'},
        { value: 'toufu', label: 'toufu'},
      ],
      selectedIngredients: []

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

  handleIngredientsChange = (selectedIngredients) => {
    this.setState(
      { selectedIngredients },
      () => console.log('ingredients selected:', this.state.selectedIngredients)
    );
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
              <Button variant="secondary" onClick={this.handleSearchToggle}> <FaSearch /> Ingredients</Button>
              <div > &nbsp; &nbsp;</div>
              <Button variant="primary"> <FaSearch /> Cuisines </Button>
            </div>
            :
            <div className="rows2">
              <Button variant="primary"> <FaSearch /> Ingredients</Button>
              <div > &nbsp; &nbsp;</div>
              <Button variant="secondary" onClick={this.handleSearchToggle}> <FaSearch /> Cuisines </Button>
            </div>
          }

          {this.state.toggleSearch ?

            // search by cuisines:
            <div className="rows">
              <InputGroup.Text id="inputGroupPrepend"> <TiHeartFullOutline/> </InputGroup.Text>
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
              <InputGroup.Text id="inputGroupPrepend"> <TiLocation/> </InputGroup.Text>
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

            :

            // search by ingredients: by Zhongyang
            <div className="rows">
              <InputGroup.Text id="inputGroupPrepend"> <TiHeartFullOutline/> </InputGroup.Text>
              <Select
                isMulti
                styles={selectStyles}
                value={this.state.selectedIngredients}
                isSearchable
                placeholder="Select ingredient(s) ... "
                size={50}
                options={this.state.ingredientOptions}
                onChange={this.handleIngredientsChange}
              />
              <div > &nbsp; &nbsp;</div>
              {/* <InputGroup.Text id="inputGroupPrepend"> <TiLocation/> </InputGroup.Text>
              <Select
                styles={selectStyles}
                value={this.state.selectedLocation}
                placeholder="Select location ... "
                size={50}
                options={this.state.locationOptions}
                onChange={this.handleLocationChange}
              /> */}
              <div > &nbsp; &nbsp;</div>
              <Button type="submit">Search</Button>
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