import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RestaurantCard extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row">
        <div className="name">{this.props.restaurant.name}</div>
        <div className="rating">{this.props.restaurant.rating}</div>
        <div className="reviews">{this.props.restaurant.review_count}</div>
      </div>
    );
  }
}