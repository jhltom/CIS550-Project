import React from 'react';
import '../style/Feature3.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import PageNavbar from './PageNavbar';

export default class Feature3 extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ingredientsOptions: [
        { value: 'Egg', label: 'Egg' },
        { value: 'Milk', label: 'Milk' },
        { value: 'Beef', label: 'Beef' },
        { value: 'Chicken', label: 'Chicken' },
        { value: 'Rice', label: 'Rice' },
        { value: 'Advocado', label: 'Advocado' },
        { value: 'Potato', label: 'Potato' },
      ],
      selectedIngredients: [],
      selectedIngredientDivs: [],
    }
  }

  componentDidMount = () => {

    // TODO: get of all ingredients from Ingredients db

    // For now for testing purposes: 
    let selectedCIngredientDivs = [
      <div className="cuisine">
        <div className="cuisineName">American</div>
        <div className="suitability">154</div>
      </div>,
      <div className="cuisine">
      <div className="cuisineName">Italian</div>
      <div className="suitability">77</div>
    </div>,
        <div className="cuisine">
        <div className="cuisineName">Korean</div>
        <div className="suitability">5</div>
    </div>

      ];
    this.setState({ selectedIngredientDivs });

  }

  handleChange = selectedIngredient => {
    this.setState(
      { selectedIngredient },
      () => console.log(`Option selected:`, this.state.selectedIngredient)
    );

    //TODO: create selectedIngredientDivs for selectedIngredient 

  };



  render() {
    return (
      <div className="Feature3">
        <PageNavbar active="Feature3" />
        <div className="container">

          <Select
            value={this.state.selectedIngredient}
            onChange={this.handleChange}
            options={this.state.ingredientOptions}
            isMulti
            isSearchable
            placeholder="Select ingredient(s) ... "
          />

          <div className="header-container">
            <div className="headers">
              <div className="cuisine"><strong>Cuisine Type</strong></div>
              <div className="cuisine"><strong>suitability</strong></div>
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