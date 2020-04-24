import React from 'react';
import '../style/Feature3.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";
import Select from 'react-select';
import PageNavbar from './PageNavbar';

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
      results: ""
    }
  }

  googleMap = React.createRef();

  success = position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    this.setState({ lat: latitude, lng: longitude });
    
    const gMapScript = document.createElement("script");
    gMapScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDOrXq_0ahcTlnhzfjrS7ruzV6Hk_v63So";

    window.document.body.appendChild(gMapScript);
    gMapScript.addEventListener("load", () => {
      this.googleMap = this.initMap();
    });
  }

  error = () => {
    console.log("Could not geolocate this browser.");
  }

  componentDidMount = async () => {
    document.getElementById("gmap").style.display = "none";
    document.getElementById("loader").style.display = "block";

    await this.fetchCuisines();

    if (!navigator.geolocation) {
      console.log("Geolocation isn't supported on your browser.");
    } else {
      navigator.geolocation.getCurrentPosition(this.success, this.error);
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

    const data = body.rows.map(row => {
      return {
        value: row[0],
        label: row[1]
      }
    });

    this.setState({ allCuisines: data });
    return;
  }

  initMap = () => {
    let stylesArray = [{"featureType":"water","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"landscape","stylers":[{"color":"#f2f2f2"}]},{"featureType":"road","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]}];
    let mapType = window.google.maps.MapTypeId.ROADMAP;
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
      map: map
    })

    this.setState({ map: map, origin: origin });

    document.getElementById("loader").style.display = "none";
    document.getElementById("gmap").style.display = "block";

    this.setState({ loading: false });
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
    this.setState({ loading: false, results: body.rows });
    this.handleShow();
  }

  render() {
    return (
      <div className="Feature3">
        <PageNavbar active="Feature3" />
        <div id="loader">
          <div className="spinner"></div>
        </div>

        <div className="container">
          <div className="row selectContainer">
            <div className="col-4 selectItem">
              <Select
                value={this.state.selectedCuisines}
                options={this.state.allCuisines}
                onChange={this.handleCuisineSelect}
                isMulti
                isSearchable
                placeholder="Select Cuisine(s) ... "
              />
            </div>

            <div className="col-4 selectItem">
              <Select
                value={this.state.radius}
                options={this.state.radii}
                onChange={this.handleRadiusSelect}
                placeholder="Select Radius ... "
              />
            </div>

            <div className="col-2">
              <Button
                variant="primary"
                disabled={this.state.loading}
                onClick={this.handleClick}
              >Search</Button>
            </div>

          </div>
        </div>

        <div id="gmap" ref={this.googleMap}>
        </div>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Results</Modal.Title>
          </Modal.Header>
          <Modal.Body>This is a work in progress:
            <br></br>
            {this.state.results}
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