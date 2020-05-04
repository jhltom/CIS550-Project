/* global google */

import React from 'react';
import { GoogleMap, Marker, InfoWindow, withScriptjs, withGoogleMap } from 'react-google-maps';
import mapStyle from './MapStyle';

const ref = React.createRef();

const MapComponent = withScriptjs(withGoogleMap(props =>
  <GoogleMap
    ref={ref}
    defaultZoom={15}
    defaultCenter={{ lat: props.lat, lng: props.lng }}
    defaultOptions={{ styles: mapStyle, mapTypeId:google.maps.MapTypeId.ROADMAP, disableDefaultUI: true}}
  >
  <Marker
    key="originMarker"
    position={{ lat: props.lat, lng: props.lng }}
  />

  {props.restaurants.map((restaurant) => (
    <Marker
      key={restaurant.ID + ''}
      position={{
        lat: restaurant.LATITUDE,
        lng: restaurant.LONGITUDE
      }}
      icon={{
        url: '/marker.png',
        scaledSize: new google.maps.Size(25, 25)
      }}
    />
  ))}

  { props.selectedRestaurant &&
    <InfoWindow
      position={{
        lat: props.selectedRestaurant.LATITUDE,
        lng: props.selectedRestaurant.LONGITUDE
      }}
    >
      <div>
        <h2>TEST</h2>
        <p>TEST</p>
      </div>
    </InfoWindow>
  }

  </GoogleMap>
));


export default class Map extends React.Component {

  constructor(props) {
    super(props);
    this.mapComponent = React.createRef();
    this.ref = ref;
    this.state = {
      selectedRestaurant: null,
      restaurants: []
    }
  }

  componentDidMount = () => {
    // this.mapInstance = window.$projectMap;
    // console.log(this.mapComponent.current);
    // let restaurants = this.props.restaurants;
    // if (restaurants && restaurants.length) {
    //   console.log("IN HERE");
    //   let bounds = new google.maps.LatLngBounds();

    //   restaurants.forEach(function(r) {
    //     let loc = new google.maps.LatLng(r.LATITUDE, r.LONGITUDE);
    //     bounds.extend(loc);
    //   });
    //   map.fitBounds(bounds);
    //   map.panToBounds(bounds);
    // }
  }

  render() {
    return (
      <div>
        <MapComponent
          ref={this.mapComponent}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAPS_API_KEY}`}
          containerElement={<div style={{ position: `absolute`, top: 0, bottom: 0, left: 0, right: 0 }} />}
          loadingElement={<div style={{ position: `absolute`, top: 0, bottom: 0, left: 0, right: 0 }} />}
          mapElement={<div style={{ position: `absolute`, top: 0, bottom: 0, left: 0, right: 0 }} />}
          lat={this.props.lat}
          lng={this.props.lng}
          restaurants={this.props.restaurants}
          selectedRestaurant={this.props.selectedRestaurant}
        />
      </div>
    );
  }
}