require("./clinics_list.css");
import React from 'react';


class ClinicsList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<div>Клиники</div>

				<ul className="clinics-list">
					{this.props.clinics.map((clinic, i) => {
						return <li key={clinic.id}>
								{clinic.name}
							</li>;
					})}
				</ul>
			</div>
		);
	}
}

export default ClinicsList;