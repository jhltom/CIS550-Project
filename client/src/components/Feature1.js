import React from 'react';
import '../style/Feature1.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import ReactSearchBox from 'react-search-box'
import PageNavbar from './PageNavbar';

export default class Feature1 extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ingredientsOptions: [],
      selectedIngredients: [],
      selectedIngredientDivs: [],
      search: null,
      options: [],
      selectedOptions:[],
    }
  }
  
  componentDidMount = async () => {

    await this.getAllIngredients();

  }

  getAllIngredients = async () => {
    await fetch("http://localhost:8081/ingredients/",{
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(result => {
      let ingredientsOptions = result.rows.map((row, i) => {
        const ingredient = row[0].trim();
        return ({
          value: ingredient,
          label: ingredient
        })
      });
      this.setState({ingredientsOptions});
      console.log(ingredientsOptions);
    }, err => {
      console.log(err);
    });
  }

  handleSearchChange = search => {
    this.setState(
      { search },
      () => console.log('search:', this.state.search)
    );
  };

  getSearchedIngredient = () => {
    fetch("http://localhost:8081/searchedIngredient/" + this.state.search,{
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
      this.setState({options});
      console.log(options);
    }, err => {
      console.log(err);
    });
  }

  handleAddChange = search => {
    this.setState(
      { search },
      () => console.log('search:', this.state.search)
    );
  };


  handleChange = async selectedIngredients => {
    this.setState(
      { selectedIngredients},
      () => console.log(`Option selected:`, this.state.selectedIngredients)
    );
    await this.getCuisines(selectedIngredients);
  };

  getCuisines = async selectedIngredients => {
    console.log('selected: ', selectedIngredients)
    if(selectedIngredients != null && selectedIngredients.length){
      let selection = selectedIngredients.map(ingredient => {
        return ingredient.value;
      });
      console.log('let lelection:', selection);
      let data = {selection:selection}
      console.log('data:', data);
      await fetch("http://localhost:8081/matchedCuisines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({data: data})
      }).then(async res => {
        return res.json();
      }, err => {
        console.warn(err);
      }).then(async result => {
        console.log('matched cuisines',result.rows);
        let selectedIngredientDivs = result.rows.map((cuisine, i) => {
          return (
            <div key={i} className="cuisine">
                <div className="cuisineName">{cuisine[0]}</div>
                <div className="matchingScore">{cuisine[1]}</div>
            </div>
          )
        });
        this.setState({selectedIngredientDivs});
      }, err => {
        console.warn(err);
      });
    }
    else{
      let selectedIngredientDivs = [
      <div className="cuisine">
        <div className="cuisineName"></div>
        <div className="matchingScore"></div>
      </div>
      ];
    this.setState({ selectedIngredientDivs });
    }
  }

  handleClick = () => {
    console.log('no repeating!!!');
  }

  render() {
    return (
      <div className="Feature1">
        <PageNavbar active="Feature1" />
        <div className="container">

          <ReactSearchBox
            placeholder="Search ingredients"
            onChange={this.handleSearchChange}
            value={this.state.search}
          />

          <button onClick={this.getSearchedIngredient}>
            Submit
          </button>

          <Select
            //value={this.state.options}
            //onChange={this.handleChange}
            options={this.state.options}
            isMulti
            isSearchable
            placeholder="Select ingredient(s) ... "
          />

          <button onClick={this.getSearchedIngredient}>
            Add To List
          </button>

          <Select
            value={this.state.selectedIngredients}
            onChange={this.handleChange}
            options={this.state.ingredientsOptions}
            isMulti
            isSearchable
            placeholder="See and select from all ingredients ... "
          />

          <div className="header-container">
            <div className="headers">
              <div className="header"><strong>Cuisine Type</strong></div>
              <div className="header"><strong>Matching Scores</strong></div>
            </div>
          </div>

          <div className="results-container" id="results">
            {this.state.selectedIngredientDivs}
          </div>

        </div>
      </div>
    );
  }
}