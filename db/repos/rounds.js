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

const sql = require('../sql').rounds;

/**
 * Rounds database interaction class.
 *
 * @class
 * @memberof db.repos
 * @requires db/sql
 * @see Parent: {@link db.repos}
 * @param {Database} db - Instance of database object from pg-promise
 * @param {Object} pgp - pg-promise instance to utilize helpers
 * @returns {Object} - An instance of a RoundsRepository
 */
class RoundsRepository {
	constructor(db, pgp) {
		this.db = db;
		this.pgp = pgp;
	}

	/**
	 * Get round information from mem tables.
	 *
	 * @returns {Promise}
	 * @todo Add description for the return value
	 */
	getMemRounds() {
		// TODO: Must use a result-specific method, not .query
		return this.db.query(sql.getMemRounds);
	}

	/**
	 * Remove a particular round from database.
	 *
	 * @param {string} round - Id of the round
	 * @returns {Promise}
	 * @todo Add description for the return value
	 */
	flush(round) {
		return this.db.none(sql.flush, [round]);
	}

	/**
	 * Delete all blocks above a particular height.
	 *
	 * @param {int} height - Description of the param
	 * @returns {Promise}
	 * @todo Add descriptions for the params and the return value
	 */
	truncateBlocks(height) {
		// TODO: This method must be in BlocksRepository, not here!
		return this.db.none(sql.truncateBlocks, [height]);
	}

	/**
	 * Update the missedBlocks attribute for an account.
	 *
	 * @param {boolean} backwards - Backwards flag
	 * @param {string} outsiders - Comma separated string of ids
	 * @returns {*}
	 * @todo Add description for the return value
	 */
	updateMissedBlocks(backwards, outsiders) {
		return this.db.none(sql.updateMissedBlocks, {
			change: backwards ? '- 1' : '+ 1',
			outsiders,
		});
	}

	// TODO: Move usage of RoundsRepository#getVotes to db/votes
	/**
	 * Get votes for a round.
	 *
	 * @param {string} round - Id of the round
	 * @returns {Promise}
	 * @todo Add description for the return value
	 */
	getVotes(round) {
		// TODO: Must use a result-specific method, not .query
		return this.db.query(sql.getVotes, [round]);
	}

	// TODO: Move usage of RoundsRepository#updateVotes to db/votes
	/**
	 * Update the votes of for a particular account.
	 *
	 * @param {string} address - Address of the account
	 * @param {int} amount - Votes to update
	 * @todo Add returns tag
	 */
	updateVotes(address, amount) {
		return this.db.none(sql.updateVotes, [amount, address]);
	}

	// TODO: Move usage of RoundsRepository#updateBlockId to db/accounts
	/**
	 * Update the blockId attribute for an account.
	 *
	 * @param {string} newId - Description of the param
	 * @param {string} oldId - Description of the param
	 * @returns {Promise}
	 * @todo Add description for the params and return value
	 */
	updateBlockId(newId, oldId) {
		return this.db.none(sql.updateBlockId, [newId, oldId]);
	}

	/**
	 * Summarize the results for a round.
	 *
	 * @param {string} round - Id of the round
	 * @param {int} activeDelegates - Number of active delegates
	 * @returns {Promise}
	 * @todo Add description for the return value
	 */
	summedRound(round, activeDelegates) {
		// TODO: Must use a result-specific method, not .query
		return this.db.query(sql.summedRound, [activeDelegates, round]);
	}

	/**
	 * Drop the table for round snapshot.
	 *
	 * @returns {Promise}
	 * @todo Add description for the return value
	 */
	clearRoundSnapshot() {
		return this.db.none(sql.clearRoundSnapshot);
	}

	/**
	 * Create table for the round snapshot.
	 *
	 * @returns {Promise}
	 * @todo Add description for the return value
	 */
	performRoundSnapshot() {
		return this.db.none(sql.performRoundSnapshot);
	}

	/**
	 * Create table for the round snapshot.
	 *
	 * @returns {Promise}
	 * @todo Add description for the return value
	 * @todo Add @param tag
	 */
	getDelegatesSnapshot(limit) {
		return this.db.query(sql.getDelegatesSnapshot, [limit]);
	}

	/**
	 * Delete table for votes snapshot.
	 *
	 * @returns {Promise}
	 * @todo Add description for the return value
	 */
	clearVotesSnapshot() {
		return this.db.none(sql.clearVotesSnapshot);
	}

	/**
	 * Take a snapshot of the votes by creating table and populating records from votes.
	 *
	 * @returns {Promise}
	 * @todo Add description for the return value
	 */
	performVotesSnapshot() {
		return this.db.none(sql.performVotesSnapshot);
	}

	/**
	 * Update accounts from the round snapshot.
	 *
	 * @returns {Promise}
	 * @todo Add description for the return value
	 */
	restoreRoundSnapshot() {
		return this.db.none(sql.restoreRoundSnapshot);
	}

	/**
	 * Update votes for account from a snapshot.
	 *
	 * @returns {Promise}
	 * @todo Add description for the return value
	 */
	restoreVotesSnapshot() {
		return this.db.none(sql.restoreVotesSnapshot);
	}

	/**
	 * Insert round information record into mem_rounds.
	 *
	 * @param {string} address - Address of the account
	 * @param {string} blockId - Associated block id
	 * @param {Number} round - Associated round number
	 * @param {Number} amount - Amount updated on account
	 * @returns {Promise}
	 * @todo Add description for the return value
	 */
	insertRoundInformationWithAmount(address, blockId, round, amount) {
		return this.db.none(sql.insertRoundInformationWithAmount, {
			address: address,
			amount: amount,
			blockId: blockId,
			round: round,
		});
	}

	/**
	 * Insert round information record into mem_rounds.
	 *
	 * @param {string} address - Address of the account
	 * @param {string} blockId - Associated block id
	 * @param {Number} round - Associated round number
	 * @param {string} delegateId - Associated delegate id
	 * @param {string} mode - Possible values of '+' or '-' represents behaviour of adding or removing delegate
	 * @returns {Promise}
	 * @todo Add description for the return value
	 */
	insertRoundInformationWithDelegate(
		address,
		blockId,
		round,
		delegateId,
		mode
	) {
		return this.db.none(sql.insertRoundInformationWithDelegate, {
			address: address,
			blockId: blockId,
			round: round,
			delegate: delegateId,
			balanceMode: mode === '-' ? '-' : '',
		});
	}
}

module.exports = RoundsRepository;
