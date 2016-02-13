require("./clinics_list.css");
import React from 'react';
import YMaps from '../ymaps.js';


class ClinicsList extends React.Component {
	constructor(props) {
		super(props);
	}

	openBalloon(id) {
		YMaps.openBalloonById(id);
	}

	render() {
		return (
			<div>
				<ul className="list-group btn-group-vertical">
					{this.props.clinics.map((clinic, i) => {
						return <li
								className="clinics-list list-group-item btn"
								onClick={this.openBalloon.bind(this, clinic.id)}
								key={clinic.id}>
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