import __ from 'lodash';

/**
 * You can extend Lodash with mixins
 * And use it as below
 * import _ from '@lodash'
 */
const _ = __.runInContext();

_.mixin({
	// Immutable Set for setting state
	setIn: (state, name, value) => {
		return _.setWith(_.clone(state), name, value, _.clone);
	},

	objectToChartDataSet: (state) => {
		let data = [];
		let labels = [];
		/* eslint-disable */
		_.each(state, (value, key) => {
			console.log(value,key)
			data = [...data, value],
			labels = [...labels, _.upperFirst(key)]
		});

		return _.clone({
			data,
			labels
		})

	}
});

export default _;
