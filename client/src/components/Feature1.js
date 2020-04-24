import React from 'react';
import '../style/Feature1.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import PageNavbar from './PageNavbar';

export default class Feature1 extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ingredientsOptions: [
        { value: 'egg', label: 'egg' },
        { value: 'milk', label: 'milk' },
        { value: 'beef', label: 'beef' },
        { value: 'chicken', label: 'chicken' },
        { value: 'rice', label: 'rice' },
        { value: 'advocado', label: 'advocado' },
        { value: 'potato', label: 'potato' },
      ],
      selectedIngredients: null,
      selectedIngredientDivs: [],
    }
  }

  componentDidMount = async () => {

    // TODO: get of all ingredients from Ingredients db

    // For now for testing purposes: 
    let selectedIngredientDivs = [
      <div className="cuisine">
        <div className="cuisineName">American</div>
        <div className="suitability">90%</div>
      </div>,
      <div className="cuisine">
      <div className="cuisineName">Italian</div>
      <div className="suitability">77%</div>
    </div>,
        <div className="cuisine">
        <div className="cuisineName">Korean</div>
        <div className="suitability">5%</div>
    </div>

      ];
    this.setState({ selectedIngredientDivs });
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
      // ingredientsOptions.sort((x, y) => {
      //   const X = x.value;
      //   const Y = y.value;
      //   return X < Y ? -1 : X > Y ? 1 : 0;
      // });
      this.setState({ingredientsOptions});
      console.log(ingredientsOptions);
    }, err => {
      console.log(err);
    });
  }

  handleChange = async selectedIngredients => {
    this.setState(
      { selectedIngredients },
      () => console.log(`Option selected:`, this.state.selectedIngredients)
    );
    console.log(selectedIngredients.value)
    await this.getCuisines(selectedIngredients.value);

  };

  getCuisines = async selectedIngredients => {
    console.log('called getCuisines on', selectedIngredients)
    await fetch("http://localhost:8081/cuisines/" + selectedIngredients,{
      method: "GET",
    }).then(async res => {
      return res.json();
    }, err => {
      console.warn(err);
    }).then(async result => {
      console.log('matched cuisines',result.rows)
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



  render() {
    return (
      <div className="Feature1">
        <PageNavbar active="Feature1" />
        <div className="container">

          <Select
            value={this.state.selectedIngredients}
            onChange={this.handleChange}
            options={this.state.ingredientsOptions}
            //isMulti
            isSearchable
            placeholder="Select ingredient(s) ... "
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