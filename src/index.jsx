require("../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("./index.css");
import React from 'react';
import ReactDOM from 'react-dom';
import { filterClinics, availableFilters, activeFilters } from './clinics_helper.js';
import Map from './map.jsx';
import Filters from './filters/filters.jsx';
import ClinicsList from './clinics_list/clinics_list.jsx';


export class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {clinics: filterClinics(activeFilters.getFilters())};
	}

	updateClinics() {
		this.setState({clinics: filterClinics(activeFilters.getFilters())});
	}

	onFiltersChange() {
		this.updateClinics();
	}

	render() {
		return (
			<div>
				<Map/>
				<Filters onChange={this.onFiltersChange.bind(this)}/>
				<ClinicsList clinics={this.state.clinics}/>
			</div>
		);
	}
}

ReactDOM.render(<App/>, document.querySelector("#app"));
