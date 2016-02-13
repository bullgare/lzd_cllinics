import React from 'react';
import FilterAbstract from './filter_abstract.jsx';

class FilterCheckbox extends FilterAbstract {
	render() {
		let filter = this.props.filter;
		let title = filter.label || '';

		return (
			<label>
				<input
					type="checkbox"
					name={filter.key}
					checked={filter.isChecked}
					onChange={this.onChange.bind(this)}
				/>
				{title}
			</label>
		);
	}
}

export default FilterCheckbox;