import React from 'react';

class FilterAbstract extends React.Component {
	constructor(props) {
		super(props);
		this.state = {filter: this.props.filter || {}};
	}

	onChange(e) {
		this.props.filter.isChecked = e.target.checked;

		if (this.props.whenChanged) {
			this.props.whenChanged(this.props.filter);
		}
	}
}

export default FilterAbstract;