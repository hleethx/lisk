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
/**
 * Description of the class.
 *
 * @class
 * @memberof helpers
 * @see Parent: {@link helpers}
 * @todo Add descriptions of the class
 */
function PeersManager() {
	this.peers = {};
	this.addressToNonceMap = {};
	this.nonceToAddressMap = {};
}

/**
 * Description of the function.
 *
 * @param {Object} peer - Description of the param
 * @todo Add descriptions of the params
 * @todo Add returns-tag
 */
PeersManager.prototype.add = function(peer) {
	// 1. do not add peers without address
	// 2. prevent changing address by the peer with same nonce
	if (
		!peer ||
		!peer.string ||
		(this.nonceToAddressMap[peer.nonce] &&
			peer.string !== this.nonceToAddressMap[peer.nonce])
	) {
		return false;
	}
	if (this.peers[peer.string]) {
		return this.update(peer);
	}
	this.peers[peer.string] = peer;
	this.addressToNonceMap[peer.string] = peer.nonce;
	if (peer.nonce) {
		this.nonceToAddressMap[peer.nonce] = peer.string;
	}
	return true;
};

/**
 * Description of the function.
 *
 * @param {Object} peer - Description of the param
 * @todo Add descriptions of the params
 * @todo Add returns-tag
 */
PeersManager.prototype.remove = function(peer) {
	if (!peer || !this.peers[peer.string]) {
		return false;
	}
	this.nonceToAddressMap[peer.nonce] = null;
	delete this.nonceToAddressMap[peer.nonce];

	this.addressToNonceMap[peer.string] = null;
	delete this.addressToNonceMap[peer.string];

	this.peers[peer.string] = null;
	delete this.peers[peer.string];

	return true;
};

/**
 * Description of the function.
 *
 * @param {Object} peer - Description of the param
 * @todo Add descriptions of the params
 * @todo Add returns-tag
 */
PeersManager.prototype.update = function(peer) {
	var oldNonce = this.addressToNonceMap[peer.string];
	var oldAddress = this.nonceToAddressMap[oldNonce];
	if (oldNonce) {
		this.nonceToAddressMap[oldNonce] = null;
		delete this.nonceToAddressMap[oldNonce];
	}
	if (oldAddress) {
		this.addressToNonceMap[oldAddress] = null;
		delete this.addressToNonceMap[oldAddress];

		this.peers[oldAddress] = null;
		delete this.peers[oldAddress];
	}
	this.add(peer);
	return true;
};

/**
 * Description of the function.
 *
 * @param {Object} peer - Description of the param
 * @todo Add descriptions of the params
 * @todo Add returns-tag
 */
PeersManager.prototype.getAll = function() {
	return this.peers;
};

/**
 * Description of the function.
 *
 * @param {Object} peer - Description of the param
 * @todo Add descriptions of the params
 * @todo Add returns-tag
 */
PeersManager.prototype.getByAddress = function(address) {
	return this.peers[address];
};

/**
 * Description of the function.
 *
 * @param {Object} peer - Description of the param
 * @todo Add descriptions of the params
 * @todo Add returns-tag
 */
PeersManager.prototype.getByNonce = function(nonce) {
	return this.peers[this.nonceToAddressMap[nonce]];
};

/**
 * Description of the function.
 *
 * @param {Object} peer - Description of the param
 * @todo Add descriptions of the params
 * @todo Add returns-tag
 */
PeersManager.prototype.getNonce = function(address) {
	return this.addressToNonceMap[address];
};

/**
 * Description of the function.
 *
 * @param {Object} peer - Description of the param
 * @todo Add descriptions of the params
 * @todo Add returns-tag
 */
PeersManager.prototype.getAddress = function(nonce) {
	return this.nonceToAddressMap[nonce];
};

module.exports = new PeersManager();
