/* global google */

import React from 'react';
import { GoogleMap, Marker, InfoWindow, withScriptjs, withGoogleMap } from 'react-google-maps';
import mapStyle from './MapStyle';


export default class Map extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedRestaurant: null,
      restaurants: []
    }
  }

  render() {
    const MapComponent = withScriptjs(withGoogleMap(props => 
      <GoogleMap
        defaultZoom={15}
        defaultCenter={{ lat: this.props.lat, lng: this.props.lng }}
        defaultOptions={{ styles: mapStyle, mapTypeId:google.maps.MapTypeId.ROADMAP, disableDefaultUI: true}}
      >
      <Marker position={{ lat: this.props.lat, lng: this.props.lng }} />

      {this.state.restaurants.map((restaurant) => (
        <Marker key={restaurant.id}
        position={{
          lat: restaurant.lat,
          lng: restaurant.lng
        }}
        icon={{
          url: '/marker.png',
          scaledSize: new google.maps.Size(25, 25)
        }}
        onClick={() => {
          this.setState({selectedRestaurant: restaurant});
        }}
        />
      ))}

      { this.state.selectedRestaurant &&
        <InfoWindow
          position={{
            lat: this.state.selectedRestaurant.lat,
            lng: this.state.selectedRestaurant.lng
          }}
          onCloseClick={() => {
            this.setState({selectedRestaurant: null});
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

    return (
      <div>
        <MapComponent
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAPS_API_KEY}`}
          containerElement={<div style={{ position: `absolute`, top: 0, bottom: 0, left: 0, right: 0 }} />}
          loadingElement={<div style={{ position: `absolute`, top: 0, bottom: 0, left: 0, right: 0 }} />}
          mapElement={<div style={{ position: `absolute`, top: 0, bottom: 0, left: 0, right: 0 }} />}
        />
      </div>
    );
  }
}