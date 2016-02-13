require("./filters.css");
import React from 'react';
import FilterCheckbox from './filter_checkbox.jsx';
import FilterRadio from './filter_radio.jsx';
import { availableFilters, activeFilters } from '../clinics_helper.js';
import updateClinics from '../clinics_ymaps'


class Filters extends React.Component {
	constructor(props) {
		super(props);
		this.state = {filters: availableFilters.getFilters()};
	}

	onFilterChange(newFilterState) {
		let key = newFilterState.key;
		activeFilters.updateFilters({[key]: newFilterState});
		this.setState({filters: availableFilters.getFilters()});
		updateClinics();
	}

	onFiltersReset() {
		activeFilters.resetFilters();
		this.setState({filters: availableFilters.getFilters()});
		updateClinics();
	}

	render() {
		return (
			<div>
				<div>Фильтры</div>

				<ul className="filters">
					{this.state.filters.map((filter, i) => {
						if (filter.type === 'checkbox') {
							return <li key={filter.key}>
								<FilterCheckbox
									filter={filter}
									whenChanged={this.onFilterChange.bind(this)}
								/>
							</li>;
						}
						else if (filter.type === 'radio') {
							return <li key={filter.key + filter.value}>
								<FilterRadio
									filter={filter}
									whenChanged={this.onFilterChange.bind(this)}
								/>
							</li>;
						}
					})}
					<li>
						<button onClick={this.onFiltersReset.bind(this)}>Сбросить все фильтры</button>
					</li>
				</ul>
			</div>
		);
	}
}

export default Filters;