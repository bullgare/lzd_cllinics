import getClinics from './clinics_data.js';

let chains = [];
/**
 * Extract all chains from filtered clinics
 *
 * @returns {Array} chains from given clinics
 */
function getChains() {
	if (chains && chains.length) {
		return chains;
	}

	let allClinics = getClinics();
	let chainCounts = {};

	allClinics.forEach(function (obj) {
		chainCounts[obj.chain] = (chainCounts[obj.chain] || 0) + 1;
	});

	chains = Object.keys(chainCounts).map(function (k) {
		let name = k || 'Несетевая';
		name = name.replace(/^Сеть клиник /, '');
		return {
			value: k,
			label: name + ' (' + chainCounts[k] + ')'
		};
	});

	return chains;
}

/**
 * Working with selected filters
 */
class ActiveFilters {
	constructor() {
		this.resetFilters();
	}

	resetFilters() {
		this.filters = Object.create(null);
	}

	updateFilters(newFilters = {}) {
		let checkedFilters = {};
		Object.keys(newFilters).forEach((key) => {
			let filter = newFilters[key];
			if (! filter.isChecked) {
				delete this.filters[key];
			}
			else checkedFilters[key] = filter;
		});
		Object.assign(this.filters, checkedFilters);
	}

	getFilters() {
		return Object.assign(Object.create(null), this.filters);
	}

	isFilterActive(key, value) {
		return !! this.filters[key] && this.filters[key].value === value;
	}
}

//export let activeFilters = new ActiveFilters();

/**
 * Working with all available filters
 */
class AvailableFilters {
	constructor(activeFilters) {
		this.activeFilters = activeFilters;
	}

	getFilters() {
		let filters = [];
		let chains = getChains();

		filters.push(this._generateFilter('home', true, 'checkbox', 'Вызов на дом'));
		filters.push(this._generateFilter('dental', true, 'checkbox', 'Стоматология'));

		chains.forEach((chain) => {
			filters.push(this._generateFilter('chain', chain.value, 'radio', chain.label));
		});

		return filters;
	}

	_generateFilter(key, value, type, label = value) {
		return {
			key: key,
			value: value,
			type: type,
			label: label,
			isChecked: this.activeFilters.isFilterActive(key, value)
		};
	}
}

//export let availableFilters = new AvailableFilters(activeFilters);

class ClinicsModel {
	constructor() {
		this.activeFilters = new ActiveFilters();
		this.availableFilters = new AvailableFilters(this.activeFilters);
	}
	/**
	 * Filters list of given clinics with keyValues
	 * @param [keyValues] {Object} filters in a form of {k: {key: a, value: true}, k: {key: b, value: false}}
	 * @returns {Array}
	 */
	filter(keyValues = {}) {
		let filtered = getClinics();
		let keys = keyValues && Object.keys(keyValues);

		if (keys.length) {
			keys.forEach(function(k) {
				let kv = keyValues[k];
				filtered = filtered.filter(function (obj) {
					return obj[kv.key] === kv.value;
				});
			});
		}
		return filtered;
	}

	getFiltered() {
		return this.filter(this.activeFilters.getFilters());
	}
}

export let clinicsModel = new ClinicsModel();