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
'use strict';

var url = require('url');
var _ = require('lodash');
var failureCodes = require('../api/ws/rpc/failure_codes.js');
var swaggerHelper = require('../helpers/swagger');
var Peer = require('../logic/peer.js');

/**
 * Description of the module.
 *
 * @module
 * @see Parent: {@link helpers}
 * @requires lodash
 * @requires url
 * @requires api/ws/rpc/failure_codes
 * @requires helpers/swagger
 * @requires logic/peer
 * @property {Object} middleware
 * @property {function} extractHeaders
 * @todo Add description of the module and its properties
 */

var definitions = swaggerHelper.getSwaggerSpec().definitions;

var z_schema = swaggerHelper.getValidator();

/**
 * Middleware functions to add cors, log errors and conections, send status
 * and setup router.
 *
 * @namespace middleware
 * @see Parent: {@link helpers.ws_api}
 * @memeberof module:helpers/ws_api
 */
var middleware = {
	/**
	 * Description of the function.
	 *
	 * @param {Object} system - Description of the param
	 * @todo Add descriptions of the function and its parameters
	 * @todo Add @returns-tag
	 */
	Handshake: function(system) {
		/**
		 * Description of the function.
		 *
		 * @param {Object} system - Description of the param
		 * @todo Add descriptions of the function and its parameters
		 * @todo Add @returns-tag
		 */
		return function(headers, cb) {
			z_schema.validate(headers, definitions.WSPeerHeaders, error => {
				if (error) {
					return setImmediate(
						cb,
						{
							code: failureCodes.INVALID_HEADERS,
							description: `${error[0].path}: ${error[0].message}`,
						},
						null
					);
				}

				headers.state = Peer.STATE.CONNECTED;
				var peer = new Peer(headers);

				if (!system.nonceCompatible(headers.nonce)) {
					return setImmediate(
						cb,
						{
							code: failureCodes.INCOMPATIBLE_NONCE,
							description: `Expected nonce to be not equal to: ${system.getNonce()}`,
						},
						peer
					);
				}

				if (!system.networkCompatible(headers.nethash)) {
					return setImmediate(
						cb,
						{
							code: failureCodes.INCOMPATIBLE_NETWORK,
							description: `Expected nethash: ${system.getNethash()} but received: ${
								headers.nethash
							}`,
						},
						peer
					);
				}

				if (!system.versionCompatible(headers.version)) {
					return setImmediate(
						cb,
						{
							code: failureCodes.INCOMPATIBLE_VERSION,
							description: `Expected version: ${system.getMinVersion()} but received: ${
								headers.version
							}`,
						},
						peer
					);
				}
				return setImmediate(cb, null, peer);
			});
		};
	},
};

/**
 * Description of the function.
 *
 * @param {Object} request - Description of the param
 * @todo Add descriptions of the function and its parameters
 * @todo Add @returns-tag
 */
var extractHeaders = function(request) {
	var headers = _.get(url.parse(request.url, true), 'query', null);
	headers.ip = request.remoteAddress.split(':').pop();
	headers.httpPort = +headers.httpPort;
	headers.wsPort = +headers.wsPort;
	headers.height = +headers.height;
	return headers;
};

module.exports = {
	middleware: middleware,
	extractHeaders: extractHeaders,
};
