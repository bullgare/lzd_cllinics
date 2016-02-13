require("../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("./index.css");
import React from 'react';
import ReactDOM from 'react-dom';
import { filterClinics, availableFilters, activeFilters } from './clinics_helper.js';
import Map from './map/map.jsx';
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
			<div className="container-fluid">
				<div className="row">
					<div className="col-xs-12">
						<Map/>
					</div>
				</div>
				<div className="row">
					<div className="col-sm-4 col-xs-12">
						<h4>Фильтры</h4>
						<Filters onChange={this.onFiltersChange.bind(this)}/>
					</div>
					<div className="col-sm-8 col-xs-12">
						<h4>Клиники</h4>
						<ClinicsList clinics={this.state.clinics}/>
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<App/>, document.querySelector("#app"));
