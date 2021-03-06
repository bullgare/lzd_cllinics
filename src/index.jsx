require("../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("./index.css");
import React from 'react';
import ReactDOM from 'react-dom';
import { clinicsModel } from './models/clinics/clinics.js';
import Map from './components/map/map.jsx';
import Filters from './components/filters/filters.jsx';
import ClinicsList from './components/clinics_list/clinics_list.jsx';


export class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {clinics: clinicsModel.getFiltered()};
	}

	updateClinics() {
		this.setState({clinics: clinicsModel.getFiltered()});
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
						<h4>Клиники <span className="badge">{this.state.clinics.length}</span></h4>
						<ClinicsList clinics={this.state.clinics}/>
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<App/>, document.querySelector("#app"));
