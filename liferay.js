'use strict';

let async = require('async');
let liferay = require('liferay-connector');

class LiferaySession {
	get PARALLEL_LIMIT() {
		return 10;
	}

	constructor(session, groupId) {
		this.session = session;
		this.groupId = groupId;
	}

	deleteLayout(layoutId, callback) {
		console.log(`Deleting layout ${layoutId}`);

		this.session.invoke({
			'/layout/delete-layout': {
				groupId: this.groupId,
				layoutId: layoutId
			}
		}, (error, result) => {
			if (error) {
				switch (error.name) {
					case 'NotFound':
						console.log(`NOT FOUND ${layoutId}`);
						break;

					default:
						return callback(error);
				}
			}

			callback(null, result);
		});
	}



	deleteArticle(articleId, callback) {
		console.log(`Deleting ${articleId}`);

		this.session.invoke({
			'/journalarticle/delete-article': {
				groupId: this.groupId,
				articleId: articleId,
				articleURL: ''
			}
		}, (error, result) => {
			if (error) {
				switch (error.name) {
					case 'NotFound':
						console.log(`NOT FOUND ${articleId}`);
						break;

					default:
						return callback(error);
				}
			}

			callback(null, result);
		});
	}

	deleteArticleVersion(articleId, version, callback) {
		console.log(`Deleting ${articleId} version ${version}`);

		this.session.invoke({
			'/journalarticle/delete-article': {
				groupId: this.groupId,
				articleId: articleId,
				version: version,
				articleURL: ''
			}
		}, (error, result) => {
			if (error) {
				switch (error.name) {
					case 'NotFound':
						console.log(`NOT FOUND ${articleId} version ${version}`);
						break;

					default:
						return callback(error);
				}
			}

			callback(null, result);
		});
	}

	deleteLayouts(layoutIds, callback) {
		async.parallelLimit(
			layoutIds
				.map(plid => this.deleteLayout.bind(this, layoutIds)),
			this.PARALLEL_LIMIT,
			callback);
	}

	deleteArticles(articleIds, callback) {
		async.parallelLimit(
			articleIds
				.map(articleId => this.deleteArticle.bind(this, articleId)),
			this.PARALLEL_LIMIT,
			callback);
	}

	deleteArticleVersions(articleIdVersionsMap, callback) {
		let tasks = [];

		Array.from(articleIdVersionsMap)
			.forEach(combination => {
				let id = combination[0];
				let versions = combination[1];

				versions.forEach(version => {
					tasks.push((callback) => this.deleteArticleVersion(id, version, callback));
				});
			});

		async.parallelLimit(tasks,
			this.PARALLEL_LIMIT,
			callback);
	}

	static authenticate(url, options) {
		return new Promise((resolve, reject) => {
			liferay.authenticate(`http://${url}`, options, (error, session) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(new LiferaySession(session, options.groupId));
			});
		});
	}
}

module.exports = LiferaySession;