import React from 'react';
import logo from '../logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import '../style/SearchPage.css';
import { FaSearch } from 'react-icons/fa';
import SearchByIngredients from './SearchByIngredients';
import SearchByCuisines from './SearchByCuisines'


export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //true = search by cuisine, false = search by ingredients
      toggleSearch: true,
    }
  }

  handleSearchToggle = () => {
    this.setState({ toggleSearch: !this.state.toggleSearch });
  }

  render() {
    return (
      < div className="SearchPage-container" >
        <div className="header">
          <img src={logo} className="SearchPage-logo" alt="logo" />
        </div>
        <div className="searchBar-container">
          {this.state.toggleSearch ?
            <div className="rows2">
              <Button variant="secondary" onClick={this.handleSearchToggle}> <FaSearch /> Ingredients</Button>
              <div > &nbsp; &nbsp;</div>
              <Button variant="primary"> <FaSearch /> Cuisines </Button>
            </div>
            :
            <div className="rows2">
              <Button variant="primary"> <FaSearch /> Ingredients</Button>
              <div > &nbsp; &nbsp;</div>
              <Button variant="secondary" onClick={this.handleSearchToggle}> <FaSearch /> Cuisines </Button>
            </div>
          }
          {this.state.toggleSearch ?
            // search by cuisines:
            <SearchByCuisines/>
            :
            // search by ingredients: by Zhongyang
            <SearchByIngredients/>
          }
        </div>
        <div className="empty"></div>
      </div >
    );
  }
}
