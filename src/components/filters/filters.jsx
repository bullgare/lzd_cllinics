require("./filters.css");
import React from 'react';
import FilterCheckbox from './filter_checkbox.jsx';
import FilterRadio from './filter_radio.jsx';
import { clinicsModel } from '../../models/clinics/clinics.js';
import YMaps from '../map/ymaps.js';


class Filters extends React.Component {
	constructor(props) {
		super(props);
		this.state = {filterSets: clinicsModel.availableFilters.getFilterSets()};
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
		this.setState({filterSets: clinicsModel.availableFilters.getFilterSets()});
		YMaps.updateMarkers();

		if (this.props.onChange) {
			this.props.onChange();
		}
	}

	render() {
		return (
			<div>
				<div className="filter-sets">
					{this.state.filterSets.map((filterSet, i) => {
						return <div key={i}>
							<div>{filterSet.title}</div>

							<ul className="filters">
								{filterSet.filters.map((filter) => {
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
							</ul>
						</div>;
					})}

					<div>
						<button
							onClick={this.onFiltersReset.bind(this)}
							className="btn btn-default"
						>Сбросить все фильтры</button>
					</div>
				</div>
			</div>
		);
	}
}

export default Filters;