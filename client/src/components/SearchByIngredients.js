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
      checked: false,
      value: [],
      displayOptions: [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
      ],
      selectedDisplay: 0,
      freq: []
    }
  }

  componentDidMount = () => {

    this.getFreq();

  }

  getFreq = () => {
    fetch("http://localhost:8081/freq",{
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(result => {
      let freq = result.rows.map((row, i) => {
        const cuisine = row[0].trim();
        const freq = row[1];
        return ({
          cuisine: cuisine,
          freq: freq
        })
      });
      this.setState({freq});
      console.log(freq);
    }, err => {
      console.log(err);
    });
  }

  getAllIngredients = () => {
    fetch("http://localhost:8081/ingredients/",{
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
        { ingredientsOptions: options },
      );
      let checked = false;
      this.setState({checked});
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
    let checked = event.target.checked;
    this.setState({checked});
    if(checked){
      let update = this.state.selectedIngredients.concat(this.state.ingredientsOptions);
      this.setState(
        { selectedIngredients: update },
        () => console.log(`All Option selected:`, this.state.selectedIngredients)
      )
    }

  };

  getCuisines = () => {
    console.log('selected: ', this.state.selectedIngredients)
    if (this.state.selectedIngredients != null && this.state.selectedIngredients.length) {
      let selection = this.state.selectedIngredients.map(ingredient => {
        return ingredient.value;
      });
      console.log('let lelection:', selection);
      let data = { 
        selection: selection,
        display: this.state.selectedDisplay.value
      }
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
          // for(let h = 0; h < this.state.freq.length; h++){
          //   console.log('enter loop');
          //   if(cuisine[0] == this.state.freq[h].cuisine){
          //     cuisine[1] = ((cuisine[1] / this.state.freq[h].freq) * 100).toFixed(2);
          //     console.log('weighted:', cuisine[1]);
          //   }
          // }
          return (
            <div key={i} className="cuisine">
              <div className="cuisineName">{cuisine[0]}</div>
              <div className="matchingScore">{cuisine[1]}%</div>
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
  }

  handleDisplayChange = selectedDisplay => {
    this.setState(
      { selectedDisplay },
      () => console.log(`Display selected:`, this.state.selectedDisplay)
    );
  };

  onChange(e, i){
    let value = this.state.value.slice();
    value[i] = e.target.checked;
    this.setState({value})
 }
     
 unCheck(i){
    let value = this.state.value.slice();
    value[i] = !value[i];
    this.setState({value})
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

          
        </div>


        <div className="header-container">
            <div className="headers">
              <div className="header"><strong>Cuisine Type</strong></div>
              <div className="header"><strong>Matching Scores</strong></div>
              <Select
                styles={selectStyles}
                value={this.state.selectedDisplay}
                placeholder="Filter Top Cuisine(s)... "
                size={50}
                options={this.state.displayOptions}
                onChange={this.handleDisplayChange}
              />
            </div>
          </div>

          <div className="results-container" id="results">
            {this.state.matchedCuisines}
          </div>


        <div>
           {[1,2,3,4,5].map((item,i) => {
             return (
                <div>
                  <input checked={this.state.value[i]} type="checkbox" onChange={(e) => this.onChange(e, i)}/>
                  <button onClick={()=>this.unCheck(i)}>Toggle</button>
                </div>
              )
           })}      
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