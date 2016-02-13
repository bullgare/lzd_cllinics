require("./clinics_list.css");
import React from 'react';


class ClinicsList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<ul className="list-group">
					{this.props.clinics.map((clinic, i) => {
						return <li className="list-group-item" key={clinic.id}>
							<div className="list-group-item-heading">
								{clinic.name}
							</div>

							<div className="list-group-item-text">
								<div>{clinic.address}</div>
								<div>{clinic.hours}</div>
								<div>{clinic.phones}</div>
							</div>
						</li>;
					})}
				</ul>
			</div>
		);
	}
}

export default ClinicsList;