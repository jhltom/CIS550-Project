import React from 'react';

export default class RestaurantCard extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="restaurant">
        <div className="thumb">
          <img src="/marker.png" />
        </div>
        <div className="content">
          <h3>{this.props.restaurant.NAME}</h3>
          <p>{this.props.restaurant.ADDRESS}</p>
          <p>Rating: {this.props.restaurant.STARS}</p>
        </div>
      </div>
    );
  }
}