import React from 'react';
import '../style/Feature3.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
// import PageNavbar from './PageNavbar';
import mapStyle from './MapStyle';
// import Map from './Map';
// import RestaurantCard from './RestaurantCard';
import UserPage from './UserPage';
import { Button, Navbar, Nav, Modal, Spinner } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import { FaSearch, FaHome, FaUserAlt, FaSignOutAlt } from 'react-icons/fa';

export default class Feature3 extends React.Component {

  constructor(props) {
    super(props);
    this.googleMap = React.createRef();
    this.markers = [];
    this.state = {
      map: null,
      lat: 0,
      lng: 0,
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
      restaurants: [],
    }
  }

  success = position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    this.setState({ lat: latitude, lng: longitude, loading: false });
    
    const gMapScript = document.createElement("script");
    gMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAPS_API_KEY}`;

    window.document.body.appendChild(gMapScript);
    gMapScript.addEventListener("load", () => {
      this.initMap();
    });
  }

  error = () => {
    console.log("Could not geolocate this browser.");
  }

  componentDidMount = async () => {
    this.fetchRestaurantsFromSearchByCuisines(); //Tom: handle data from SearchByCuisines component

    // await this.fetchCuisines();

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

  initMap = () => {
    let stylesArray = mapStyle;
    let mapType = "roadmap";
    let map = new window.google.maps.Map(this.googleMap.current, {
      zoom: 15,
      center: {
        lat: this.state.lat,
        lng: this.state.lng
      },
      disableDefaultUI: true,
      mapTypeId: mapType,
      styles: stylesArray
    });

    let origin = new window.google.maps.Marker({
      position: {
        lat: this.state.lat,
        lng: this.state.lng
      },
      animation: window.google.maps.Animation.DROP,
      map: map
    })

    this.setState({ map: map, origin: origin, loading: false });
  }

  updateMap = (data) => {
    // Delete existing markers
    if (this.markers.length) {
      this.markers.forEach(function(marker) {
        marker.setMap(null);
      });
      this.markers = [];
    }

    let map = this.state.map;
    let bounds = new window.google.maps.LatLngBounds();
    let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Create markers and expand map bounds
    data.forEach((item, idx) => {
      let loc = new window.google.maps.LatLng(item.LATITUDE, item.LONGITUDE);
      bounds.extend(loc);

      let marker = new window.google.maps.Marker({
        position: {
          lat: item.LATITUDE,
          lng: item.LONGITUDE
        },
        animation: window.google.maps.Animation.DROP,
        // label: labels[idx % labels.length],
        icon: {
          url: "/marker.png",
          scaledSize: new window.google.maps.Size(30, 30)
        }
      });
      // marker.addListener('click', () => {
      //   console.log(item);
      // });
      this.markers.push(marker);
    });

    // Adjust map bounds
    map.fitBounds(bounds);
    map.panToBounds(bounds);

    // Place markers
    this.markers.forEach((marker, idx) => {
      window.setTimeout(() => {
        marker.setMap(map);
      }, idx * 100);
    });
  }

  markerToggle = idx => {
    // let marker = this.markers[idx];
    // if (marker.getAnimation() !== null) {
    //   marker.setAnimation(null);
    // } else {
    //   marker.setAnimation(window.google.maps.Animation.BOUNCE);
    // }
  }

  markerBounce = idx => {
    this.markers[idx].setAnimation(window.google.maps.Animation.BOUNCE);
  }

  markerStop = idx => {
    this.markers[idx].setAnimation(null);
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
    this.setState({ loading: false, restaurants: body.data });
    this.updateMap(body.data);
    // this.handleShow();
  }

  /**
   * User Modal
   */
  userModal = () =>{
    return (
      <Modal show={this.state.showUser} onHide={this.handleCloseUserModal}>
        <Modal.Header closeButton>
          <Modal.Title>User</Modal.Title>
        </Modal.Header>
        <UserPage/>
      </Modal>
    )
  }
  signOutModal = () =>{
    return (
      <Modal show={this.state.showSignOut} onHide={this.handleCloseSignOutModal}>
        <Modal.Header closeButton>
          <Modal.Title>Signed out!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Redirecting to main page . . . <Spinner animation="border" /> </Modal.Body>
      </Modal>
    )
  }
  handleShowUserModal = () =>{
    this.setState({ showUser: true });
  }
  handleCloseUserModal = () =>{
    this.setState({ showUser: false });
  }
  handleShowSignOutModal = () =>{
    this.setState({ showSignOut: true });
  }
  handleCloseSignOutModal = () =>{
    this.setState({ showSignOut: false });
  }
  handleLogOut = async () =>{
    try {
      await Auth.signOut();
      this.handleShowSignOutModal();
      setTimeout(this.navigateToMain, 2000);
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  render() {
    return (
      <div className="Feature3">
        <div id="navWrapper">
          <div className="navBar">
            <Navbar bg="transparent" >
              <Navbar.Brand href="/Main" >
                <FaHome />
              </Navbar.Brand>
              <Nav className="mr-auto"> </Nav>
              <Navbar.Brand onClick={this.handleShowUserModal} >
                <FaUserAlt />
              </Navbar.Brand>
              <Navbar.Brand onClick={this.handleLogOut} >
                <FaSignOutAlt />
              </Navbar.Brand>
            </Navbar>
          </div>
        </div>
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
          {this.state.restaurants.map((restaurant, idx) => (
            <div 
              className="restaurant"
              key={`restaurant-${restaurant.ID}`}
              onClick={() => this.markerToggle(idx)}
              onMouseEnter={() => this.markerBounce(idx)}
              onMouseLeave={() => this.markerStop(idx)}
            >
              <div className="thumb">
                <img src="/marker.png" />
              </div>
              <div className="content">
                <h3>{restaurant.NAME}</h3>
                <p>{restaurant.ADDRESS}</p>
                <p>Rating: {restaurant.STARS}</p>
              </div>
            </div>
          ))}
          </div>
          <div id="gmap" ref={this.googleMap}></div>
        </div>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Restaurants</Modal.Title>
          </Modal.Header>
          <Modal.Body>This is a work in progress:
            <br></br>
            TEMP FILLER
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