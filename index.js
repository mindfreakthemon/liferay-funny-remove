#!/usr/bin/env node

'use strict';

let LiferaySession = require('./liferay');
let reader = require('./reader');

let argv = require('yargs')
	.usage('Usage: $0 <command> [options]')

	.option('username', {
		alias: 'u',
		required: true,
		describe: 'liferay admin username',
		global: true
	})

	.option('password', {
		alias: 'p',
		required: true,
		describe: 'liferay admin username',
		global: true
	})

	.option('url', {
		alias: 'l',
		required: true,
		describe: 'liferay hostname',
		global: true
	})

	.option('groupId', {
		alias: 'g',
		required: true,
		describe: 'liferay group id',
		number: true,
		global: true
	})

	.command('remove-wcs <filename>', 'Remove web contents listed in given CSV file', {})

	.command('remove-wc-versions <filename>', 'Remove web contents\' versions listed in given CSV file, but spare first N versions with --spare (defaults to 1)', {
		spare: {
			alias: 's',
			describe: 'spare last N versions',
			required: true,
			requiresArgs: true,
			number: true,
			default: 1
		}
	})

	.command('remove-layouts <filename>', 'Remove layouts listed in given CSV file', {})


	.example('$0 remove-wc wcs.csv -u admin -p pass -l myliferayhostname.com', 'remove webcontents')
	.example('$0 remove-wc-versions wcs-versions.csv -s 3 -u admin -p pass -l myliferayhostname.com', 'remove all versions but last 3')
	.example('$0 remove-layouts layouts.csv -u admin -p pass -l myliferayhostname.com', 'remove all layouts')

	.help('h')
	.alias('h', 'help')

	.argv;

let command = argv._[0];


LiferaySession
	.authenticate(argv.url, {
		login: argv.username,
		password: argv.password,
		groupId: argv.groupId
	})
	.then(liferaySession => {

		let promise = reader.read(argv.filename);

		promise.then(output => {
			switch (command) {
				case 'remove-wcs':
					liferaySession.deleteArticles(output, () => {
						console.log('done');
					});

					break;

				case 'remove-wc-versions':
					let wcVersions = new Map();

					output.forEach(item => {
						let id = item[0],
							version = item[1];

						if (wcVersions.has(id)) {
							wcVersions.get(id).push(version);
						} else {
							wcVersions.set(id, [version]);
						}
					});

					for (let combination of wcVersions) {
						// sort so that latest version will be at the end
						combination[1].sort();

						for (let i = 0; i < argv.spare; i++) {
							// remove last N versions
							combination[1].pop();
						}
					}

					liferaySession.deleteArticleVersions(wcVersions, () => {
						console.log('done');
					});

					break;

				case 'remove-layouts':
					liferaySession.deleteLayouts(output, () => {
						console.log('done');
					});

					break;
			}
		});

		return promise;
	})
	.catch(error => console.error(error))
