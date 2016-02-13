//import getClinics from './clinics_data.js';
import { clinicsModel } from '../../models/clinics/clinics.js';

ymaps.ready(init);

let myMap;

function init () {
	myMap = new ymaps.Map("map", {
		center: [55.76, 37.64],
		zoom: 10,
		controls: ["zoomControl", "typeSelector", "fullscreenControl", "rulerControl"]
	});

	YMaps.updateMarkers();
}

let placemarksByIds = {};
/**
 * Redraw markers on a map by clinics data
 * @param clinics {Array}
 */
function addObjects(clinics) {
	let mapObjects = myMap.geoObjects;
	mapObjects.removeAll();
	placemarksByIds = {};

	clinics.forEach(function (clinic) {
		addObject(clinic);
	});

	function addObject(clinic) {
		let color = '#a5260a';
		if (clinic.dental) {
			color = '#0095b6';
		}
		else if (! clinic.home) {
			color = '#735184';
		}

		let placemark = new ymaps.Placemark(clinic.coords, {
			balloonContent: generateContentForMarker(clinic)
		}, {
			preset: 'islands#dotIcon',
			iconColor: color
		});
		placemarksByIds[clinic.id] = placemark;
		mapObjects.add(placemark);
	}
}

function generateContentForMarker(clinic) {
	let services  =[];
	if (clinic.dental) {
		services.push('стоматология');
	}
	if (clinic.home) {
		services.push('вызов врача');
	}

	let content = '';
	if (clinic.name) {
		content += '<h2>' + clinic.name + '</h2>\n';
	}
	if (clinic.address) {
		content += '<h4>' + clinic.address + '</h4>\n';
	}

	content += '<dl class="dl-horizontal">';
	if (clinic.phones) {
		content += '<dt>Телефоны</dt><dd>' + clinic.phones + '</dd>\n';
	}
	if (clinic.hours) {
		content += '<dt>Режим</dt><dd>' + clinic.hours + '</dd>\n';
	}
	if (services.length) {
		content += '<dt>Услуги</dt><dd>' + services.join(', ') + '</dd>\n';
	}
	content += '</dl>';

	return content;
}

/**
 * Methods for working with yandex maps
 */
export default class YMaps {
	/**
	 * Update markers by current filtered clinics
	 */
	static updateMarkers() {
		addObjects(clinicsModel.getFiltered());
	}

	/**
	 * Toggles balloon by clinic is
	 * @param id {Number}
	 */
	static toggleBalloonById(id) {
		if (placemarksByIds[id]) {
			let balloon = placemarksByIds[id].balloon;
			if (balloon.isOpen()) {
				balloon.close()
			}
			else {
				balloon.open();
			}
		}
	}
}
