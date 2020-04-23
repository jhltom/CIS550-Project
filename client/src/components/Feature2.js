import React from 'react';
import '../style/Feature2.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import PageNavbar from './PageNavbar';

export default class Feature2 extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      cuisineOptions: [
        { value: 'American', label: 'American' },
        { value: 'Chinese', label: 'Chinese' },
        { value: 'French', label: 'French' },
        { value: 'Indian', label: 'Indian' },
        { value: 'Korean', label: 'Korean' },
        { value: 'Mexican', label: 'Mexican' },
        { value: 'Spanish', label: 'Spanish' },
      ],
      selectedCuisine: null,
      selectedCuisineDivs: [],
    }
  }

  componentDidMount = async () => {

    await fetch("http://localhost:8081/cuisineTypes/",
      {
        method: 'GET'
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(result => {
        let cuisineOptions = result.rows.map((row, i) => {
          const cuisineType = row[0].trim();
          return ({
            value: cuisineType,
            label: cuisineType
          })
        });
        cuisineOptions.sort((x, y) => {
          const X = x.value.toUpperCase();
          const Y = y.value.toUpperCase();
          return X < Y ? -1 : X > Y ? 1 : 0;
        });
        this.setState({ cuisineOptions });
      }, err => {
        console.log(err);
      });
  }

  handleChange = async selectedCuisine => {
    this.setState(
      { selectedCuisine },
      () => console.log(`Option selected:`, this.state.selectedCuisine)
    );
    await this.getRestaurants(selectedCuisine.value);
  };

  getRestaurants = async selectedCuisine => {
    console.log('called', selectedCuisine)
    await fetch("http://localhost:8081/cuisineRestaurants/" + selectedCuisine, {
      method: "GET",
    }).then(async res => {
      // console.log("resultado: ", res.json());
      // if (res.status >= 400) {
      //   throw new Error("Bad response from server. Status: " + res.status);
      // }
      return res.json();
    }, err => {
      console.warn(err);
    }).then(async result => {
      console.log(result.rows)
      let selectedCuisineDivs = result.rows.map((restaurant, i) => {
        return (
          <div key={i} className="restaurant">
            <div className="restaurantName">{restaurant[1]}</div>
            <div className="cuisineType">{selectedCuisine}</div>
            <div className="address">{restaurant[2]}</div>
            <div className="open">Open</div>
          </div>
        )
      });
      this.setState({ selectedCuisineDivs });
    }, err => {
      console.warn(err);
    });
  }

  handleOpenHours = () => {
    // TODO: determine whether each restaurant is open at a given time

  }


  render() {
    return (
      <div className="Feature2">
        <PageNavbar active="Feature2" />
        <div className="container">

          <Select
            value={this.state.selectedCuisine}
            onChange={this.handleChange}
            options={this.state.cuisineOptions}
            isSearchable
            placeholder="Select cuisine(s) ... "
          />

          <div className="header-container">
            <div className="headers">
              <div className="header"><strong>Retaurant</strong></div>
              <div className="header"><strong>Cuisine Type</strong></div>
              <div className="header"><strong>Address</strong></div>
              <div className="header"><strong>Open/Closed</strong></div>
            </div>
          </div>

          <div className="results-container" id="results">
            {this.state.selectedCuisineDivs}
          </div>

        </div>
      </div>
    );
  }
}