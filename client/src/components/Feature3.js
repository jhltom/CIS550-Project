import React from 'react';
import '../style/Feature3.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import mapStyle from './MapStyle';
import UserPage from './UserPage';
import { Button, Navbar, Nav, Modal, Spinner } from 'react-bootstrap';
import { Auth, API } from 'aws-amplify';
import { FaSearch, FaHome, FaUserAlt, FaSignOutAlt } from 'react-icons/fa';

export default class Feature3 extends React.Component {

  constructor(props) {
    super(props);
    this.googleMap = React.createRef();
    this.markers = [];
    this.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.state = {
      map: null,
      lat: 39.9522188,
      lng: -75.1954024,
      origin: null,
      loading: true,
      selectedCuisines: [],
      selectedCities: [],
      selectedState: null,
      allCuisines: [],
      allCities: [],
      radius: { value: 2, label: '2' },
      radii: [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
      ],
      unfiltered: [],
      restaurants: [],
      useLocation: false,
      filterOpen: false
    }
  }

  componentDidMount = async () => {
    const gMapScript = document.createElement("script");
    gMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAPS_API_KEY}`;

    window.document.body.appendChild(gMapScript);
    gMapScript.addEventListener("load", () => {
      this.initMap(this.fetchRestaurantsFromSearchByCuisines);
    });
  }

  addToFavorite = async (restaurant) =>{
    alert("Restaurant added!")
    Auth.currentAuthenticatedUser()
      //if logged in already
      .then(async user => {
        const userId = user.username;
        const response = await API.get("cis550proj", `/users/${userId}`);
        const firstName = response[0].firstName;
        const lastName = response[0].lastName;
        const favoriteCuisines = response[0].favoriteCuisines;
        let favoriteRestaurants = response[0].favoriteRestaurants;
        favoriteRestaurants.push(restaurant);
        await API.put("cis550proj", "/users", {
          body: {
            id: userId,
            firstName: firstName,
            lastName: lastName,
            favoriteCuisines: favoriteCuisines,
            favoriteRestaurants: favoriteRestaurants
          }
        });
      })
      //if not logged in
      .catch(err => {
        console.log(err)
        this.setState({ userLogged: false });
      })
  }

  // Tom: data passed from SearchByCuisines component will be stored in "this.props.location.state"
  fetchRestaurantsFromSearchByCuisines = async () =>{
    if (this.props.location){
      const { selectedCities, selectedState, selectedCuisines } = this.props.location.state;
      console.log("data received 1: ", selectedCuisines);
      console.log("data received 2: ", selectedState);
      console.log("data received 3: ", selectedCities);

      let payload = {
        selection: selectedCuisines
      }

      const response = await fetch("http://localhost:8081/cuisineInfo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({data: payload})
        }
      );
      const body = await response.json();
      const data = body.data.map(row => {
        return {
          value: row.CUISINEID,
          label: row.CUISINE
        }
      });

      let cities = selectedCities.map(function(city) {
        return {
          value: city,
          label: city
        }
      });

      this.setState(
        { allCuisines: data,
          selectedCuisines: data,
          selectedState: selectedState,
          allCities: cities,
          selectedCities: cities,
          useLocation: selectedState === "Current Location"
        }, () => {
        if (selectedState === "Current Location") {
          if (!navigator.geolocation) {
            console.log("Geolocation isn't supported on your browser.");
          } else {
            navigator.geolocation.getCurrentPosition(this.success, this.error);
          }
        } else {
          this.regularSearch();
        }
      });
    }
  }

  success = async position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    let updateOrigin = this.state.origin;

    if (latitude !== this.state.lat || longitude !== this.state.lng) {
      updateOrigin.setMap(null);

      updateOrigin = new window.google.maps.Marker({
        position: {
          lat: latitude,
          lng: longitude
        },
        animation: window.google.maps.Animation.DROP,
        map: this.state.map
      });
    }

    let selection = this.state.selectedCuisines.map(cuisine => {
      return cuisine.value;
    });

    let payload1 = {
      lat: latitude,
      lng: longitude,
      radius: 2,
      selection: selection
    }

    const response_r = await fetch("http://localhost:8081/restaurantsNearby",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({data: payload1})
      }
    );
    const body_r = await response_r.json();

    let preHours = body_r.data;
    let returnedIds = preHours.map(function(r) {
      return r.ID;
    });

    let payload2 = {
      selection: returnedIds
    }

    const response_h = await fetch("http://localhost:8081/restaurantHours",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({data: payload2})
      }
    );
    const body_h = await response_h.json();

    let hourMap = new Map();

    body_h.data.forEach(function(h) {
      let info = hourMap.get(h.BUSINESSID);
      info = info ? info : [];
      info.push(h);
      hourMap.set(h.BUSINESSID, info);
    });

    preHours.forEach(function(r) {
      let info = hourMap.get(r.ID);
      info = info ? info : [];
      r.hours = info;
    });

    this.setState({ lat: latitude,
                    lng: longitude,
                    loading: false,
                    restaurants: preHours,
                    unfiltered: preHours,
                    origin: updateOrigin
                  });
    this.updateMap(preHours);
  }

  error = () => {
    console.log("Could not geolocate this browser.");
  }

  regularSearch = async () => {
    let selection = this.state.selectedCuisines.map(cuisine => {
      return cuisine.value;
    });
    let cities = this.state.selectedCities.map(city => {
      return city.value;
    });
    let payload1 = {
      selection: selection,
      state: this.state.selectedState,
      cities: cities
    }

    const response_r = await fetch("http://localhost:8081/restaurantConditions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({data: payload1})
      }
    );
    const body_r = await response_r.json();

    let preHours = body_r.data;
    let returnedIds = preHours.map(function(r) {
      return r.ID;
    });

    let payload2 = {
      selection: returnedIds
    }

    const response_h = await fetch("http://localhost:8081/restaurantHours",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({data: payload2})
      }
    );
    const body_h = await response_h.json();

    let hourMap = new Map();

    body_h.data.forEach(function(h) {
      let info = hourMap.get(h.BUSINESSID);
      info = info ? info : [];
      info.push(h);
      hourMap.set(h.BUSINESSID, info);
    });

    preHours.forEach(function(r) {
      let info = hourMap.get(r.ID);
      info = info ? info : [];
      r.hours = info;
    });

    let origin = this.state.origin;
    origin.setMap(null);

    this.setState({ loading: false, unfiltered: preHours, restaurants: preHours, origin: null });
    this.updateMap(preHours);
  }

  initMap = (callback) => {
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
    });

    this.setState({ map: map, origin: origin }, () => {
      callback();
    });
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
    // let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

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

  markerBounce = idx => {
    this.markers[idx].setAnimation(window.google.maps.Animation.BOUNCE);
  }

  markerStop = idx => {
    this.markers[idx].setAnimation(null);
  }

  handleCuisineSelect = async selectedCuisine => {
    selectedCuisine = selectedCuisine ? selectedCuisine : [];

    this.setState({ selectedCuisines: selectedCuisine }, () => {
      let all = this.state.selectedCuisines.length === this.state.allCuisines.length;
      let none = this.state.selectedCuisines.length === 0;
      let emptyField = this.state.selectedCities.length === 0;
      let filtered = this.state.unfiltered;

      if (!all && !none && !emptyField) {
        let cuisineSet = new Set(this.state.selectedCuisines.map((obj) => {
          return obj.value;
        }));

        let citiesSet = new Set(this.state.selectedCities.map((obj) => {
          return obj.value;
        }));

        filtered = filtered.filter((r) => {
          let cuisineIds = r.CUISINEIDS.trim().split(",").map((id) => {
            return parseInt(id);
          });

          let pass = cuisineIds.map((id) => {
            return cuisineSet.has(id);
          }).reduce((result, item) => {
            return result || item;
          }, false);

          return pass && citiesSet.has(r.CITY);
        });

        if (this.state.filterOpen) {
          let now = new Date();
          let val = now.getHours() * 100 + now.getMinutes();

          filtered = filtered.filter((r) => {
            let hours = r.hours;
            hours = hours.filter((hour) => {
              let sameDay = hour.DAY.trim() === this.days[now.getDay()];
              let allDay = hour.ALLDAY === 1;
              let openNow = hour.STARTHOUR <= val && val < hour.ENDHOUR

              return sameDay && (allDay || openNow);
            });

            return hours.length > 0;
          });
        }
      }

      filtered = (none || emptyField) ? [] : filtered;

      this.setState({ restaurants: filtered });
      this.updateMap(filtered);
    });
  }

  handleCitySelect = async selectedCities => {
    selectedCities = selectedCities ? selectedCities : [];

    this.setState({ selectedCities: selectedCities }, () => {
      let all = this.state.selectedCities.length === this.state.allCities.length;
      let none = this.state.selectedCities.length === 0;
      let emptyField = this.state.selectedCuisines.length === 0;
      let filtered = this.state.unfiltered;

      if (!all && !none && !emptyField) {
        let cuisineSet = new Set(this.state.selectedCuisines.map((obj) => {
          return obj.value;
        }));

        let citiesSet = new Set(this.state.selectedCities.map((obj) => {
          return obj.value;
        }));

        filtered = filtered.filter((r) => {
          let cuisineIds = r.CUISINEIDS.trim().split(",").map((id) => {
            return parseInt(id);
          });

          let pass = cuisineIds.map((id) => {
            return cuisineSet.has(id);
          }).reduce((result, item) => {
            return result || item;
          }, false);

          return pass && citiesSet.has(r.CITY);
        });

        if (this.state.filterOpen) {
          let now = new Date();
          let val = now.getHours() * 100 + now.getMinutes();

          filtered = filtered.filter((r) => {
            let hours = r.hours;
            hours = hours.filter((hour) => {
              let sameDay = hour.DAY.trim() === this.days[now.getDay()];
              let allDay = hour.ALLDAY === 1;
              let openNow = hour.STARTHOUR <= val && val < hour.ENDHOUR

              return sameDay && (allDay || openNow);
            });

            return hours.length > 0;
          });
        }
      }

      filtered = (none || emptyField) ? [] : filtered;

      this.setState({ restaurants: filtered });
      this.updateMap(filtered);
    });
  }

  handleRadiusSelect = async selectedRadius => {
    this.setState({ radius: selectedRadius });
  }

  handleClick = async () => {
    this.setState({ loading: true });

    let selection = this.state.selectedCuisines.map(cuisine => {
      return cuisine.value;
    });

    let payload1 = {
      lat: this.state.lat,
      lng: this.state.lng,
      radius: this.state.radius.value,
      selection: selection
    }

    const response_r = await fetch("http://localhost:8081/restaurantsNearby",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({data: payload1})
      }
    );
    const body_r = await response_r.json();

    let preHours = body_r.data;
    let returnedIds = preHours.map(function(r) {
      return r.ID;
    });

    let payload2 = {
      selection: returnedIds
    }

    const response_h = await fetch("http://localhost:8081/restaurantHours",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({data: payload2})
      }
    );
    const body_h = await response_h.json();

    let hourMap = new Map();

    body_h.data.forEach(function(h) {
      let info = hourMap.get(h.BUSINESSID);
      info = info ? info : [];
      info.push(h);
      hourMap.set(h.BUSINESSID, info);
    });

    preHours.forEach(function(r) {
      let info = hourMap.get(r.ID);
      info = info ? info : [];
      r.hours = info;
    });

    this.setState({ loading: false, restaurants: preHours, unfiltered: preHours });
    this.updateMap(preHours);
  }

  toggleOpenNow = () => {
    this.setState({ filterOpen: !this.state.filterOpen }, () => {
      let filtered = this.state.restaurants;

      if (this.state.filterOpen) {
        let now = new Date();
        let val = now.getHours() * 100 + now.getMinutes();

        filtered = filtered.filter((r) => {
          let hours = r.hours;
          hours = hours.filter((hour) => {
            let sameDay = hour.DAY.trim() === this.days[now.getDay()];
            let allDay = hour.ALLDAY === 1;
            let openNow = hour.STARTHOUR <= val && val < hour.ENDHOUR

            return sameDay && (allDay || openNow);
          });

          return hours.length > 0;
        });
      } else {
        filtered = this.state.unfiltered;

        let all = (this.state.selectedCuisines.length === this.state.allCuisines.length) &&
                  (this.state.selectedCities.length === this.state.allCities.length);

        let none = (this.state.selectedCuisines.length === 0 || this.state.selectedCities.length === 0);
        
        if (!all && !none) {
          let cuisineSet = new Set(this.state.selectedCuisines.map((obj) => {
            return obj.value;
          }));

          let citiesSet = new Set(this.state.selectedCities.map((obj) => {
            return obj.value;
          }));

          filtered = filtered.filter((r) => {
            let cuisineIds = r.CUISINEIDS.trim().split(",").map((id) => {
              return parseInt(id);
            });

            let pass = cuisineIds.map((id) => {
              return cuisineSet.has(id);
            }).reduce((result, item) => {
              return result || item;
            }, false);

            return pass && citiesSet.has(r.CITY);
          });
        }

        filtered = none ? [] : filtered;
      }

      this.setState({restaurants: filtered});
      this.updateMap(filtered);
    });
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
          <div className="selectLabels">
            <div className="selectLabel"><h4>Cuisines</h4></div>
            <div className="selectLabel"><h4>Cities</h4></div>
            <div className="selectLabel"><h4>Radius (Miles)</h4></div>
            <div className="sm-flex"></div>
          </div>
          <div className="selectInputs">
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
                value={this.state.selectedCities}
                options={this.state.allCities}
                onChange={this.handleCitySelect}
                isMulti
                isSearchable
                placeholder="Select City(s) ... "
                isDisabled={this.state.useLocation}
              />
            </div>
            <div className="selectItem">
              <Select
                value={this.state.radius}
                options={this.state.radii}
                onChange={this.handleRadiusSelect}
                placeholder="Select Radius (Miles) ... "
                isDisabled={!this.state.useLocation}
              />
            </div>

            <Button
              className="sm-flex"
              variant="primary"
              disabled={this.state.loading || !this.state.useLocation}
              onClick={this.handleClick}
            >Update</Button>
          </div>
          <div className="checkbox-container">
            <label>
              <input
                type="checkbox"
                checked={this.state.filterOpen}
                onChange={this.toggleOpenNow}
              />
                Open Now
            </label>
          </div>
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
                <Button variant="link" onClick={() => this.addToFavorite(restaurant)}>Add to favorites</Button>
              </div>
            </div>
          ))}
          </div>
          <div id="gmap" ref={this.googleMap}></div>
        </div>
        {this.signOutModal()}
        {this.userModal()}
      </div>
    );
  }
}