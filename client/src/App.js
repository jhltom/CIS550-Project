import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Home from './components/Home';
import Feature2 from './components/Feature2';
import './App.css';

function App() {
	return (
		<div className="App">
			<Router>
				<Switch>
					<Route
						exact
						path="/"
						render={() => (
							<Home />
						)}
					/>
					<Route
						exact
						path="/Home"
						render={() => (
							<Home />
						)}
					/>
					<Route
						exact
						path="/Feature2"
						render={() => (
							<Feature2 />
						)}
					/>
				</Switch>
			</Router>
		</div>
	);
}

export default App;