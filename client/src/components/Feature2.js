import React from 'react';
import '../style/Feature2.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import PageNavbar from './PageNavbar';

export default class Feature2 extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      day: "",
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
    const date = new Date();
    const day = date.getDay();
    let dayStr = "";
    switch (day) {
      case 0: dayStr = "Sun"; break;
      case 1: dayStr = "Mon"; break;
      case 2: dayStr = "Tue"; break;
      case 3: dayStr = "Wed"; break;
      case 4: dayStr = "Thu"; break;
      case 5: dayStr = "Fri"; break;
      case 6: dayStr = "Sat"; break;
    }
    this.setState({ day: dayStr });

    await this.getCuisineTypes();
  }

  getCuisineTypes = async () => {
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
    console.log('day', this.state.day)
    await fetch("http://localhost:8081/cuisineRestaurants/" + selectedCuisine + "/" + this.state.day, {
      method: "GET",
    }).then(async res => {
      return res.json();
    }, err => {
      console.warn(err);
    }).then(async result => {
      console.log(result.rows)
      const date = new Date();
      const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
      let time;
      let selectedCuisineDivs = result.rows.map((restaurant, i) => {

        if (restaurant[3] === 'CA') time = new Date(utc + (3600000 * -7));
        else time = new Date(utc + (3600000 * -4));
        const timeFormatted = Number(String(time.getHours()).padStart(2, '0') + String(time.getMinutes()).padStart(2, '0'))

        let isOpen;

        if (restaurant[6] < timeFormatted && timeFormatted < restaurant[7]) {
          isOpen = true;
        } else {
          isOpen = false
        }
        console.log("Start:", restaurant[6], " End:", restaurant[7], " CurrTime:", timeFormatted)
        return (
          <div key={i} className="restaurant">
            <div className="restaurantName">{restaurant[1]}</div>
            <div className="cuisineType">{selectedCuisine}</div>
            <div className="address">{restaurant[2]}</div>
            {isOpen ? <div className="open">Open</div> : <div className="open">Closed</div> }
            <div className="startTime">{restaurant[6]}</div>
            <div className="endTime">{restaurant[7]}</div>
            <div className="currTime">{timeFormatted}</div>
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
              <div className="header"><strong>Start At</strong></div>
              <div className="header"><strong>Close At</strong></div>
              <div className="header"><strong>Curr Time</strong></div>
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