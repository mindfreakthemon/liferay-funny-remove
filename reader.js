'use strict';

let csv = require('csv-parse');
let fs = require('fs');

exports.read = (filename) => {
	return new Promise((resolve, reject) => {
		let contents = fs.readFileSync(filename);

		csv(contents, { delimiter: '\t' }, (error, output) => {
			if (error) {
				reject(error);
				return;
			}

			resolve(output);
		});
	});
}