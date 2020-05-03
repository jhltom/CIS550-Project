import React from 'react';
import '../style/Feature3.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import PageNavbar from './PageNavbar';
import Map from './Map';
import RestaurantCard from './RestaurantCard';

export default class Feature3 extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      map: null,
      lat: null,
      lng: null,
      origin: null,
      loading: true,
      selectedCuisines: [],
      allCuisines: [],
      radius: null,
      radii: [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
      ],
      show: false,
      restaurants: []
    }
  }

  googleMap = React.createRef();

  success = position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    this.setState({ lat: latitude, lng: longitude, loading: false });
  }

  error = () => {
    console.log("Could not geolocate this browser.");
  }

  componentDidMount = async () => {
    // this.fetchRestaurantsFromSearchByCuisines(); //Tom: handle data from SearchByCuisines component

    await this.fetchCuisines();

    if (!navigator.geolocation) {
      console.log("Geolocation isn't supported on your browser.");
    } else {
      navigator.geolocation.getCurrentPosition(this.success, this.error);
    }
  }

  // Tom: data passed from SearchByCuisines component will be stored in "this.props.location.state"
  fetchRestaurantsFromSearchByCuisines = () =>{
    if (this.props.location){
      const { selectedCities, selectedState, selectedCuisines } = this.props.location.state;
      console.log("data received 1: ", selectedCuisines);
      console.log("data received 2: ", selectedState);
      console.log("data received 3: ", selectedCities);
      // TODO: fetch restaurants based on "selectedLocation" and "selectedCuisines"
    }
  }

  fetchCuisines = async () => {
    const response = await fetch("http://localhost:8081/cuisineTypesFull",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    const body = await response.json();

    const data = body.data.map(row => {
      return {
        value: row.CUISINEID,
        label: row.CUISINE
      }
    });

    // const data = [{ value: 9, label: "Korean"}];

    this.setState({ allCuisines: data });
    return;
  }

  handleCuisineSelect = async selectedCuisine => {
    this.setState({ selectedCuisines: selectedCuisine });
  }

  handleRadiusSelect = async selectedRadius => {
    this.setState({ radius: selectedRadius });
  }

  handleShow = async () => this.setState({ show: true });
  handleClose = async () => this.setState({ show: false });

  handleClick = async () => {
    this.setState({ loading: true });
    let selection = this.state.selectedCuisines.map(cuisine => {
      return cuisine.value;
    });
    let data = {
      lat: this.state.lat,
      lng: this.state.lng,
      radius: this.state.radius.value,
      selection: selection
    }

    const response = await fetch("http://localhost:8081/restaurantsNearby",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({data: data})
      }
    );
    const body = await response.json();
    this.setState({ loading: false, restaurants: body.rows });
    this.handleShow();
  }

  render() {
    return (
      <div className="Feature3">
        <PageNavbar active="Feature3" />
        { this.state.loading &&
        <div id="loader">
          <div className="spinner"></div>
        </div>
        }
        <div className="selectSection">
          <div className="selectItem">
            <Select
              value={this.state.selectedCuisines}
              options={this.state.allCuisines}
              onChange={this.handleCuisineSelect}
              isMulti
              isSearchable
              placeholder="Select Cuisine(s) ... "
            />
          </div>

          <div className="selectItem">
            <Select
              value={this.state.radius}
              options={this.state.radii}
              onChange={this.handleRadiusSelect}
              placeholder="Select Radius ... "
            />
          </div>

          <Button
            variant="primary"
            disabled={this.state.loading}
            onClick={this.handleClick}
          >Search</Button>

        </div>

        <div className="displaySection">
          <div className="restaurantContainer">
          {this.state.restaurants.length === 0 &&
            <div className="noResults">No results to show</div>
          }
          {this.state.restaurants.map((restaurant) => (
            <RestaurantCard restaurant={restaurant} />
          ))}
          </div>
          <div id="gmap" ref={this.googleMap}>
          { !this.state.loading &&
            <Map lat={this.state.lat} lng={this.state.lng}/>
          }
          </div>
        </div>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Restaurants</Modal.Title>
          </Modal.Header>
          <Modal.Body>This is a work in progress:
            <br></br>
            {this.state.restaurants}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }
}