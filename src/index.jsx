require("../node_modules/bootstrap/dist/css/bootstrap.min.css");
import React from 'react';
import ReactDOM from 'react-dom';
import Map from './map.jsx';
import Filters from './filters/filters.jsx';


export class App extends React.Component {
	render() {
		return (
			<div>
				<Map/>
				<Filters/>
			</div>
		);
	}
}

ReactDOM.render(<App/>, document.querySelector("#app"));
