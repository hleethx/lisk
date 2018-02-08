/*
 * Copyright © 2018 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

/**
 * @namespace db
 * @property {module:db} db
 */

'use strict';

const Promise = require('bluebird');
const monitor = require('pg-monitor');
let pgp = require('pg-promise');
const repos = require('require-all')({
	dirname: `${__dirname}/repos`,
	excludeDirs: /^\.(index|index.js)$/,
});

// TODO: Had to change it from 'const' into 'let' because of the nasty 'rewire' hacks inside DBSandbox.js.
// eslint-disable-next-line prefer-const
let initOptions = {
	pgNative: true,
	capSQL: true,
	promiseLib: Promise,

	// Extending the database protocol with our custom repositories;
	// API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
	extend: object => {
		Object.keys(repos).forEach(repoName => {
			object[repoName] = new repos[repoName](object, pgp);
		});
	},
};

pgp = pgp(initOptions);

/**
 * @module db
 * @requires bluebird
 * @requires pg-monitor
 * @requires pg-promise
 * @requires db/repos/*
 * @see Parent: {@link db}
 */

/**
 * Connects to the database.
 *
 * @function connect
 * @param {Object} config - Description of the param
 * @param {function} logger - Description of the param
 * @returns {Promise}
 * @todo Add descriptions for the params and return value
 */
module.exports.connect = (config, logger) => {
	try {
		monitor.detach();
	} catch (ex) {
		logger.log('database connect exception - ', ex);
	}

	monitor.attach(initOptions, config.logEvents);
	monitor.setTheme('matrix');

	monitor.log = (msg, info) => {
		logger.log(info.event, info.text);
		info.display = false;
	};

	config.user = config.user || process.env.USER;

	pgp.end();

	const db = pgp(config);

	return db.migrations.applyAll().then(() => db);
};

/**
 * Detaches pg-monitor. Should be invoked after connect.
 *
 * @function disconnect
 * @param {Object} logger - Description of the param
 * @todo Add descriptions for the params
 */
module.exports.disconnect = logger => {
	logger = logger || console;
	try {
		monitor.detach();
	} catch (ex) {
		logger.log('database disconnect exception - ', ex);
	}
};
