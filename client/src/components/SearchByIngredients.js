import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import '../style/SearchPage.css';
import ReactSearchBox from 'react-search-box'
import { Checkbox } from 'semantic-ui-react'

export default class SearchByIngredients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredientsOptions: [],
      search: null,
      selectedIngredients: [],
      selectedOptions: [],
      matchedCuisines: [],
      currSet: new Set(),
      checked: false
    }
  }

  handleIngredientsChange = (selectedIngredients) => {
    this.setState(
      { selectedIngredients },
      () => console.log('ingredients selected:', this.state.selectedIngredients)
    );
  }
  handleSearchChange = (search) => {
    this.setState(
      { search },
      () => console.log('search:', this.state.search)
    );
  }
  getSearchedIngredient = () => {
    this.state.check = false;
    fetch("http://localhost:8081/searchedIngredient/" + this.state.search, {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(result => {
      let options = result.rows.map((row, i) => {
        const option = row[0].trim();
        return ({
          value: option,
          label: option
        })
      });
      this.setState(
        { ingredientsOptions: options }
      );
      console.log(options);
      console.log('test uncheck', this.state.checked);
    }, err => {
      console.log(err);
    });
  }
  handleSelectedChange = selectedIngredients => {
    this.setState(
      { selectedIngredients },
      () => console.log(`Option selected:`, this.state.selectedIngredients)
    );
  };

  handleCheck = (event) => {
    console.log(event.target.checked);
    if (event.target.checked) {
      let update = this.state.selectedIngredients.concat(this.state.ingredientsOptions);
      console.log("before reset");
      this.setState(

        { checked: true },
        { selectedIngredients: update },
        () => console.log(`All Option selected:`, this.state.selectedIngredients)
      );
    }
    else {
      this.setState(
        { checked: false },
        () => console.log('uncheck it')
      );
    }
    console.log(this.state.checked);
  };

  getCuisines = () => {
    console.log('selected: ', this.state.selectedIngredients)
    if (this.state.selectedIngredients != null && this.state.selectedIngredients.length) {
      let selection = this.state.selectedIngredients.map(ingredient => {
        return ingredient.value;
      });
      console.log('let lelection:', selection);
      let data = { selection: selection }
      console.log('data:', data);
      fetch("http://localhost:8081/matchedCuisines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: data })
      }).then(async res => {
        return res.json();
      }, err => {
        console.warn(err);
      }).then(async result => {
        console.log('matched cuisines', result.rows);
        let matchedCuisines = result.rows.map((cuisine, i) => {
          return (
            <div key={i} className="cuisine">
              <div className="cuisineName">{cuisine[0]}</div>
              <div className="matchingScore">{cuisine[1]}</div>
            </div>
          )
        });
        this.setState({ matchedCuisines: matchedCuisines });
      }, err => {
        console.warn(err);
      });
    }
    else {
      let matchedCuisines = [
        <div className="cuisine">
          <div className="cuisineName"></div>
          <div className="matchingScore"></div>
        </div>
      ];
      this.setState({ matchedCuisines: matchedCuisines });
    }
    console.log('display matchedCuisines:', this.state.matchedCuisines);
  }


  render() {

    return (
      <div>
        <div className="rows">
          <Button type="submit" onClick={this.getSearchedIngredient}>
            Search
              </Button>

          <ReactSearchBox
            placeholder="Search Keyword..."
            onChange={this.handleSearchChange}
            value={this.state.search}
          />

          <div > &nbsp; &nbsp;</div>
          <Select
            isMulti
            styles={selectStyles}
            value={this.state.selectedIngredients}
            isSearchable
            placeholder="Select ingredient(s) ... "
            size={50}
            options={this.state.ingredientsOptions}
            onChange={this.handleSelectedChange}
          />
          <div class="Checkbox">
            <Checkbox
              type="checkbox"
              checked={this.state.checked}
              onClick={this.handleCheck}
            />
            <label>Select All Types</label>
          </div>
          <Button type="submit" onClick={this.getCuisines}>See Cuisines</Button>

        </div>
        <div className="rows">

          <div className="header-container">
            <div className="headers">
              <div className="header"><strong>Cuisine Type</strong></div>
              <div className="header"><strong>Matching Scores</strong></div>
            </div>
          </div>

          <div className="results-container" id="results">
            {this.state.matchedCuisines}
          </div>
        </div>
      </div>
    )
  }
}

// style for React components
const selectStyles = {
  container: base => ({
    ...base,
    flex: 1
  })
};