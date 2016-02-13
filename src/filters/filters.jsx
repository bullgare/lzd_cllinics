require("./filters.css");
import React from 'react';
import FilterCheckbox from './filter_checkbox.jsx';
import FilterRadio from './filter_radio.jsx';
import { clinicsModel } from '../models/clinics_helper.js';
import YMaps from '../map/ymaps.js';


class Filters extends React.Component {
	constructor(props) {
		super(props);
		this.state = {filters: clinicsModel.availableFilters.getFilters()};
	}

	onFilterChange(newFilterState) {
		let key = newFilterState.key;
		clinicsModel.activeFilters.updateFilters({[key]: newFilterState});
		this.updateClinicsList();
	}

	onFiltersReset() {
		clinicsModel.activeFilters.resetFilters();
		this.updateClinicsList();
	}

	updateClinicsList() {
		this.setState({filters: clinicsModel.availableFilters.getFilters()});
		YMaps.updateMarkers();

		if (this.props.onChange) {
			this.props.onChange();
		}
	}

	render() {
		return (
			<div>
				<ul className="filters">
					{this.state.filters.map((filter, i) => {
						if (filter.type === 'checkbox') {
							return <li className="checkbox" key={filter.key}>
								<FilterCheckbox
									filter={filter}
									whenChanged={this.onFilterChange.bind(this)}
								/>
							</li>;
						}
						else if (filter.type === 'radio') {
							return <li className="radio" key={filter.key + filter.value}>
								<FilterRadio
									filter={filter}
									whenChanged={this.onFilterChange.bind(this)}
								/>
							</li>;
						}
					})}
					<li>
						<button
							onClick={this.onFiltersReset.bind(this)}
							className="btn btn-default"
						>Сбросить все фильтры</button>
					</li>
				</ul>
			</div>
		);
	}
}

export default Filters;