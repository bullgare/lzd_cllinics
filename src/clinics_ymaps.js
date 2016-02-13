//import getClinics from './clinics_data.js';
import { activeFilters, filterClinics } from './clinics_helper.js';

ymaps.ready(init);

let myMap;

function init () {
	myMap = new ymaps.Map("map", {
		center: [55.76, 37.64],
		zoom: 10
	}, {
		searchControlProvider: 'yandex#search'
	});

	updateClinics();
}

let placemarksByIds = {};
function addObjects(clinics) {
	let mapObjects = myMap.geoObjects;
	mapObjects.removeAll();
	placemarksByIds = {};

	clinics.forEach(function (obj) {addObject(obj);});

	function addObject(obj) {
		let color = '#a5260a';
		if (obj.dental) {
			color = '#0095b6';
		}
		else if (! obj.home) {
			color = '#735184';
		}

		let services  =[];
		if (obj.dental) {
			services.push('стоматология');
		}
		if (obj.home) {
			services.push('вызов врача');
		}

		let content = '';
		if (obj.name) {
			content += '<h2>' + obj.name + '</h2>\n';
		}
		if (obj.address) {
			content += '<h4>' + obj.address + '</h4>\n';
		}

		content += '<dl class="dl-horizontal">';
		if (obj.phones) {
			content += '<dt>Телефоны</dt><dd>' + obj.phones + '</dd>\n';
		}
		if (obj.hours) {
			content += '<dt>Режим</dt><dd>' + obj.hours + '</dd>\n';
		}
		if (services.length) {
			content += '<dt>Услуги</dt><dd>' + services.join(', ') + '</dd>\n';
		}
		content += '</dl>';

		let placemark = new ymaps.Placemark(obj.coords, {
			balloonContent: content
		}, {
			preset: 'islands#dotIcon',
			iconColor: color
		});
		placemarksByIds[obj.id] = placemark;
		mapObjects.add(placemark);
	}
}

function updateClinics() {
	addObjects(filterClinics(activeFilters.getFilters()));
}

export function openBalloonById(id) {
	if (placemarksByIds[id]) {
		placemarksByIds[id].balloon.open();
	}
}

export default updateClinics;
//export openBalloonById;