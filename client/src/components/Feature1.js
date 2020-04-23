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

  }

  handleChange = selectedIngredients => {
    this.setState(
      { selectedIngredients },
      () => console.log(`Option selected:`, this.state.selectedIngredients)
    );

    //TODO: create selectedIngredientDivs for selectedIngredient 

  };



  render() {
    return (
      <div className="Feature1">
        <PageNavbar active="Feature1" />
        <div className="container">

          <Select
            value={this.state.selectedIngredients}
            onChange={this.handleChange}
            options={this.state.ingredientsOptions}
            isMulti
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