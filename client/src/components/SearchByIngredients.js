import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, DropdownButton, Dropdown, Spinner, Form, Modal } from 'react-bootstrap';
import Select from 'react-select';
import '../style/SearchPage.css';
import ReactSearchBox from 'react-search-box'
import { Checkbox } from 'semantic-ui-react'

import { Link } from "react-router-dom";
import { TiHeartFullOutline, TiLocation } from "react-icons/ti";
import { IconContext } from "react-icons";
import { API, Auth } from 'aws-amplify'

export default class SearchByIngredients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      ingredientsOptions: [],
      search: null,
      selectedIngredients: [],
      selectedOptions: [],
      matchedCuisines: [],
      displayCuisines: [],
      checked: false,
      //value: [],
      displayOptions: [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
      ],
      displayOptionSelected: "",
      selectedDisplay: 20,
      freq: [],


      citiesOptions: [],
      stateOptions: [
        { value: 'CA', label: 'CA' },
        { value: 'CT', label: 'CT' },
        { value: 'DE', label: 'DE' },
        { value: 'HI', label: 'HI' },
        { value: 'NJ', label: 'NJ' },
        { value: 'NY', label: 'NY' },
        { value: 'PA', label: 'PA' },
      ],
      selectedState: null,
      _selectedState: "",
      selectedCities: [],
      _selectedCities: [],
      _selectedCuisines: [],
      _selectedCuisineId: [],
      lat: null,
      lng: null,
      loading: false,

      //modal
      showModal: false,
      matchedCuisines: [],
      hideCuisines: true

    }
  }

  componentDidMount = async () => {

    await Auth.currentAuthenticatedUser()
      //if logged in already
      .then(async user => {
        const userId = user.username;
        this.setState({ userId })
      })
      //if not logged in
      .catch(err => {
        console.log(err)
      })

  }

  getFreq = () => {
    fetch("http://localhost:8081/freq", {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(result => {
      let freq = result.rows.map((row, i) => {
        const cuisine = row[0].trim();
        const freq = row[1];
        return ({
          cuisine: cuisine,
          freq: freq
        })
      });
      this.setState({ freq });
      console.log(freq);
    }, err => {
      console.log(err);
    });
  }

  getAllIngredients = () => {
    fetch("http://localhost:8081/ingredients/", {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(result => {
      let ingredientsOptions = result.rows.map((row, i) => {
        const ingredient = row[0].trim();
        return ({
          value: ingredient,
          label: ingredient
        })
      });
      this.setState({ ingredientsOptions });
      console.log(ingredientsOptions);
    }, err => {
      console.log(err);
    });
  }

  handleIngredientsChange = (selectedIngredients) => {
    this.setState(
      { selectedIngredients },
      () => console.log('ingredients selected:', this.state.selectedIngredients)
    );
  }
  handleSearchChange = (search) => {
    this.setState(
      { search },
      () => console.log('search:', this.state.search)
    );
  }
  getSearchedIngredient = () => {
    fetch("http://localhost:8081/searchedIngredient/" + this.state.search, {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(result => {
      let options = result.rows.map((row, i) => {
        const option = row[0].trim();
        return ({
          value: option,
          label: option
        })
      });
      this.setState(
        { ingredientsOptions: options },
      );
      let checked = false;
      this.setState({ checked });
      console.log(options);
      console.log('test uncheck', this.state.checked);
    }, err => {
      console.log(err);
    });
  }
  handleSelectedChange = selectedIngredients => {
    this.setState(
      { selectedIngredients },
      () => console.log(`Option selected:`, this.state.selectedIngredients)
    );
  };

  handleCheck = (event) => {
    let checked = event.target.checked;
    this.setState({ checked });
    if (checked) {
      let update = this.state.selectedIngredients.concat(this.state.ingredientsOptions);
      this.setState(
        { selectedIngredients: update },
        () => console.log(`All Option selected:`, this.state.selectedIngredients)
      )
    }

  };

  getCuisines = () => {

    // open moda;
    this.setState({ showModal: true })

    console.log('selected: ', this.state.selectedIngredients)
    if (this.state.selectedIngredients != null && this.state.selectedIngredients.length) {
      let selection = this.state.selectedIngredients.map(ingredient => {
        return ingredient.value;
      });
      console.log('let lelection:', selection);
      let data = {
        selection: selection,
        display: this.state.selectedDisplay.value
      }
      console.log('data:', data);
      fetch("http://localhost:8081/matchedCuisines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: data })
      }).then(async res => {
        return res.json();
      }, err => {
        console.warn(err);
      }).then(async result => {

        console.log('matched cuisines', result.rows);
        let matchedCuisines = result.rows.map((cuisine, i) => {
          return (
            <div key={i} className="cuisine">
              <div className="cuisineName">{cuisine[0]}</div>
              <div className="matchingScore">{cuisine[1].toFixed(2)}%</div>
            </div>
          )
        });
        this.setState({ matchedCuisines: result.rows });
        this.setState({ displayCuisines: matchedCuisines });

        let _selectedCuisines = [];
        result.rows.map((cuisine) => {
          _selectedCuisines.push(cuisine[0]);
        });
        this.setState({ _selectedCuisines: _selectedCuisines });

        let _selectedCuisineId = [];
        result.rows.map((cuisine) => {
          _selectedCuisineId.push(cuisine[2]);
        });
        this.setState({ _selectedCuisineId: _selectedCuisineId });

      }, err => {
        console.warn(err);
      });
    }
    else {
      let matchedCuisines = [
        <div className="cuisine">
          <div className="cuisineName"></div>
          <div className="matchingScore"></div>
        </div>
      ];
      this.setState({ matchedCuisines: matchedCuisines });
      this.setState({ displayCuisines: matchedCuisines });
    }
  }

  getCuisineId = () => {
    console.log('_selectedCuisines: ', this.state._selectedCuisines)
    if (this.state.selectedIngredients != null && this.state.selectedIngredients.length) {
      let data = {
        _selectedCuisines: this.state._selectedCuisines,
      }
      console.log('data:', data);
      fetch("http://localhost:8081/matchedCuisines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: data })
      }).then(async res => {
        return res.json();
      }, err => {
        console.warn(err);
      }).then(async result => {

        console.log('matched cuisines', result.rows);
        let matchedCuisines = result.rows.map((cuisine, i) => {
          return (
            <div key={i} className="cuisine">
              <div className="cuisineName">{cuisine[0]}</div>
              <div className="matchingScore">{cuisine[1].toFixed(2)}%</div>
            </div>
          )
        });
        this.setState({ matchedCuisines: result.rows });
        this.setState({ displayCuisines: matchedCuisines });

        let _selectedCuisines = [];
        result.rows.map((cuisine) => {
          _selectedCuisines.push(cuisine[0]);
        });
        this.setState({ _selectedCuisines: _selectedCuisines });

      }, err => {
        console.warn(err);
      });
    }
  }

  handleDisplayChange = selectedDisplay => {
    let display = selectedDisplay.value;
    this.setState(
      { selectedDisplay: selectedDisplay },
      () => console.log(`Display selected:`, this.state.selectedDisplay)
    );

    let slice = this.state.matchedCuisines.slice(0, display);
    console.log('slice:', slice);

    let displayCuisines = slice.map((cuisine, i) => {
      return (
        <div key={i} className="cuisine">
          <div className="cuisineName">{cuisine[0]}</div>
          <div className="matchingScore">{cuisine[1].toFixed(2)}%</div>
        </div>
      )
    });

    this.setState(
      { displayCuisines: displayCuisines },
      () => console.log('displayCuisines:', this.state.displayCuisines)
    );

    let _selectedCuisines = [];
    slice.map((cuisine) => {
      _selectedCuisines.push(cuisine[0]);
    });
    this.setState(
      { _selectedCuisines: _selectedCuisines },
      () => console.log('_selectedCuisines:', _selectedCuisines)
    );

    let _selectedCuisineId = [];
    slice.map((cuisine) => {
      _selectedCuisineId.push(cuisine[2]);
    });
    this.setState(
      { _selectedCuisineId: _selectedCuisineId },
      () => console.log('_selectedCuisineId:', _selectedCuisineId)
    );

  };

  //   onChange(e, i){
  //     let value = this.state.value.slice();
  //     value[i] = e.target.checked;
  //     this.setState({value})
  //  }

  //  unCheck(i){
  //     let value = this.state.value.slice();
  //     value[i] = !value[i];
  //     this.setState({value})
  //  }

  fetchCities = async (state) => {
    console.log(state)
    await fetch("http://localhost:8081/cities/" + state,
      {
        method: 'GET'
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(result => {
        console.log("result: ", result)
        let citiesOptions = result.rows.map((row, i) => {
          const citiesOption = row[0].trim();
          return ({
            value: citiesOption,
            label: citiesOption
          })
        });
        citiesOptions.sort((x, y) => {
          const X = x.value.toUpperCase();
          const Y = y.value.toUpperCase();
          return X < Y ? -1 : X > Y ? 1 : 0;
        });
        this.setState({ citiesOptions });
      }, err => {
        console.log(err);
      });
  }
  handleCitiesChange = (selectedCities) => {
    let _selectedCities = [];
    if (selectedCities) {
      selectedCities.map((element) => {
        _selectedCities.push(element.value);
      })
    }
    this.setState({ selectedCities, _selectedCities });
  }
  handleStateChange = (selectedState) => {
    this.setState({ selectedState, _selectedState: selectedState.value, selectedCities: [], _selectedCities: [] });
    this.fetchCities(selectedState.value);
  }
  validateSearch = () => {
    return (
      this.state._selectedCities.length > 0 &&
      this.state._selectedState.length > 0 &&
      this.state.displayCuisines.length > 0
    )
  }
  handleCurrentLocation = () => {
    this.setState({
      selectedState: [{ value: 'Current Location', label: 'Current Location' }],
      _selectedState: 'Current Location',
      selectedCities: [{ value: 'Current Location', label: 'Current Location' }],
      _selectedCities: ['Current Location'],
    })
    if (!navigator.geolocation) {
      console.log("Geolocation isn't supported on your browser.");
    } else {
      navigator.geolocation.getCurrentPosition(this.success, this.error);
    }
  }
  handleLosAngeles = () => {
    this.setState({
      selectedState: [{ value: 'CA', label: 'CA' }],
      _selectedState: 'CA',
      selectedCities:
        [
          { value: 'Los Angeles', label: 'Los Angeles' },
          { value: 'Anaheim', label: 'Anaheim' },
          { value: 'Garnden Grove', label: 'Garnden Grove' },
          { value: 'Glendale', label: 'Glendale' },
          { value: 'Huntington Beach', label: 'Huntington Beach' },
          { value: 'Irvine', label: 'Irvine' },
          { value: 'Long Beach', label: 'Long Beach' },
          { value: 'Moreno Valley', label: 'Moreno Valley' },
          { value: 'Ontario', label: 'Ontario' },
          { value: 'Oxnard', label: 'Oxnard' },
          { value: 'Pasadena', label: 'Pasadena' },
          { value: 'Rancho Cucamonga', label: 'Rancho Cucamonga' },
          { value: 'Riverside', label: 'Riverside' },
          { value: 'San Bernardino', label: 'San Bernardino' },
          { value: 'Santa Ana', label: 'Santa Ana' },
          { value: 'Santa Clarita', label: 'Santa Clarita' },
          { value: 'Torrance', label: 'Torrance' },
        ],
      _selectedCities: ['Los Angeles', "Anaheim", "Garnden Grove", "Glendale",
        "Huntington Beach", "Irvine", 'Long Beach', 'Moreno Valley', 'Ontario', 'Oxnard', 'Pasadena', 'Rancho Cucamonga', 'Riverside',
        'San Bernardino', 'Santa Ana', 'Santa Clarita', 'Torrance'],
    })
  }
  handleNewYorkCity = () => {
    this.setState({
      selectedState: [{ value: 'NY', label: 'NY' }],
      _selectedState: 'NY',
      selectedCities: [{ value: 'New York', label: 'New York' }, { value: 'New York City', label: 'New York City' }],
      _selectedCities: ['New York', 'New York City'],
    })
  }
  handlePhiladelphia = () => {
    this.setState({
      selectedState: [{ value: 'PA', label: 'PA' }],
      _selectedState: 'PA',
      selectedCities:
        [
          { value: 'Philadelphia', label: 'Philadelphia' },
          { value: 'Bucks', label: 'Bucks' },
          { value: 'Chester', label: 'Chester' },
          { value: 'Delaware', label: 'Delaware' },
          { value: 'Montgomery', label: 'Montgomery' },
        ],
      _selectedCities: ['Philadelphia', 'Bucks', 'Chester', 'Delaware', 'Montgomery'],
    })
  }
  handleSanFrancisco = () => {
    this.setState({
      selectedState: [{ value: 'CA', label: 'CA' }],
      _selectedState: 'CA',
      selectedCities: [{ value: 'San Francisco', label: 'San Francisco' }],
      _selectedCities: ['San Francisco'],
    })
  }

  success = position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    this.setState({ lat: latitude, lng: longitude, loading: false });
    console.log("latitude: ", latitude);
    console.log("latitude: ", longitude);
  }

  error = () => {
    console.log("Could not geolocate this browser.");
  }
  handleCloseModal = () => {
    this.setState({ showModal: false })
  }
  cuinesSelected = () => {
    console.log(this.state._selectedCuisines);
    console.log(this.state._selectedCuisineId);

    let matchedCuisines = []
    this.state._selectedCuisines.map((val) => {
      matchedCuisines.push({ value: val, label: val })
    })

    this.setState({ matchedCuisines, hideCuisines: false });
    this.handleCloseModal();
  }

  cuisineMatchingModal = () => {
    return (
      <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
        <Modal.Body>
          <div className="header-container">
            <div className="headers">
              <div className="header"><strong>Cuisine Type</strong></div>
              <div className="header"><strong>Matching Scores</strong></div>
            </div>
          </div>
          <div className="results-container" id="results">
            {this.state.displayCuisines}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div>Filter Top Cuisine(s)</div>
          <Select
            styles={selectStyles}
            placeholder={''}
            value={this.state.selectedDisplay}
            size={50}
            options={this.state.displayOptions}
            onChange={this.handleDisplayChange}
          />
          <Button variant="secondary" onClick={this.cuinesSelected}>Done</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  handleMatchedCuisines = (matchedCuisines) => {
    this.setState({ matchedCuisines });
    if (!matchedCuisines) {
      this.setState({ hideCuisines: true });
    }
  }
  showCuisineSearch = () =>{
   this.setState({hideCuisines: true});
  }

  render() {

    return (
      <div>
        {this.cuisineMatchingModal()}

        {this.state.hideCuisines ?

          <div className="rows">
            <Button type="submit" onClick={this.getSearchedIngredient}>
              Search
            </Button>

            <ReactSearchBox
              placeholder="Search Keyword..."
              onChange={this.handleSearchChange}
              value={this.state.search}
            />
            <div > &nbsp; &nbsp;</div>

            <Select
              isMulti
              styles={selectStyles}
              value={this.state.selectedIngredients}
              isSearchable
              placeholder="Select ingredient(s) ... "
              size={50}
              options={this.state.ingredientsOptions}
              onChange={this.handleSelectedChange}
            />
            <div > &nbsp; &nbsp;</div>
            <div class="Checkbox">
              <Checkbox
                type="checkbox"
                style={{ display: 'inline-flex', flexDirection: 'row' }}
                checked={this.state.checked}
                onClick={this.handleCheck}
              /> <label>Select All Types</label>
            </div>
            <div > &nbsp; &nbsp;</div>
            <Button type="submit" onClick={this.getCuisines}>See Cuisines</Button>
          </div>

          :
          <div>
            <div className="rows">
              <IconContext.Provider value={{ style: { color: 'white', marginRight: '5' } }}>
                <TiHeartFullOutline size={35} />
              </IconContext.Provider>
              <Select
                isMulti
                styles={selectStyles}
                value={this.state.matchedCuisines}
                // isSearchable
                placeholder=""
                // options={this.state.cuisineOptions}
                onChange={this.handleMatchedCuisines}
              />
              <div > &nbsp; &nbsp;</div>
              <Button type="submit" onClick={this.showCuisineSearch}> ⏎ Return to Ingredients</Button>
            </div>

            <div className="rows3">
              <IconContext.Provider value={{ style: { color: 'white', marginRight: '5' } }}>
                <TiLocation size={35} />
              </IconContext.Provider>
              <DropdownButton id="dropdown-item-button" title="☆">
                <Dropdown.Item as="button" onClick={this.handleCurrentLocation}>Current Location</Dropdown.Item>
                <Dropdown.Item as="button" onClick={this.handleLosAngeles}>Greater Los Angeles Area</Dropdown.Item>
                <Dropdown.Item as="button" onClick={this.handleNewYorkCity}>Greater New York Area</Dropdown.Item>
                <Dropdown.Item as="button" onClick={this.handlePhiladelphia}>Greater Philadelphia Area</Dropdown.Item>
                <Dropdown.Item as="button" onClick={this.handleSanFrancisco}>Greater San Francisco Bay Area</Dropdown.Item>
              </DropdownButton>
              <div > &nbsp; &nbsp;</div>
              <Select
                styles={selectStyles}
                value={this.state.selectedState}
                placeholder="Select State"
                options={this.state.stateOptions}
                onChange={this.handleStateChange}
              />
              <div > &nbsp; &nbsp;</div>
              <Select
                styles={selectStyles}
                value={this.state.selectedCities}
                isMulti
                placeholder="Select Cities"
                options={this.state.citiesOptions}
                onChange={this.handleCitiesChange}
              />

              <div > &nbsp; &nbsp;</div>

              <Link
                to={{
                  pathname: `/Feature3`,
                  state: {// place data you want to send here!
                    selectedCities: this.state._selectedCities,
                    selectedState: this.state._selectedState,
                    selectedCuisines: this.state._selectedCuisineId,
                    lat: this.state.lat,
                    lng: this.state.lng,
                  }
                }}>
                <Button
                  type="submit" disabled={!this.validateSearch()}
                > See Restaurants </Button>
              </Link>

            </div>
          </div>

        }

        {/* <div>
           {[1,2,3,4,5].map((item,i) => {
             return (
                <div>
                  <input checked={this.state.value[i]} type="checkbox" onChange={(e) => this.onChange(e, i)}/>
                  <button onClick={()=>this.unCheck(i)}>Toggle</button>
                </div>
              )
           })}      
      </div> */}

      </div>

    )
  }
}

// style for React components
const selectStyles = {
  container: base => ({
    ...base,
    flex: 1
  })
};