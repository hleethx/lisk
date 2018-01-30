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

var rewire = require('rewire');
var modulesLoader = require('../../../common/modulesLoader');
var BlocksUtils= rewire('../../../../modules/blocks/utils.js');

var viewRow_full_blocks_list = [{
	b_id: '13068833527549895884',
	b_height: 3,
	t_id: '6950874693022090568',
	t_type: 0
}];

describe('blocks/utils', function () {

	var __private;
	var library;
	var blocksUtilsModule;
	var dbStub;
	var loggerStub;
	var blockStub;
	var transactionStub;

	describe('Utils', function () {

		before(function (done) {
			dbStub = {
				blocks: {
					getIdSequence: sinonSandbox.stub().resolves(),
					getHeightByLastId: sinonSandbox.stub().resolves(['1']),
					loadLastBlock: sinonSandbox.stub().resolves(viewRow_full_blocks_list),
					loadBlocksData: sinonSandbox.stub().resolves(viewRow_full_blocks_list),
					aggregateBlocksReward: sinonSandbox.stub().resolves()
				}
			};

			blockStub = {
				dbRead: sinonSandbox.stub().withArgs(viewRow_full_blocks_list).returns({id: viewRow_full_blocks_list[0].b_id, height: viewRow_full_blocks_list[0].b_height})
			};
			transactionStub = {
				dbRead: sinonSandbox.stub().withArgs(viewRow_full_blocks_list).returns({id: viewRow_full_blocks_list[0].t_id, type: viewRow_full_blocks_list[0].t_type})
			};

			loggerStub = {
				trace: sinonSandbox.spy(),
				info:  sinonSandbox.spy(),
				error: sinonSandbox.spy()
			};

			blocksUtilsModule =  new BlocksUtils(loggerStub, blockStub, transactionStub, dbStub, modulesLoader.scope.dbSequence, modulesLoader.scope.genesisblock);
			library = BlocksUtils.__get__('library');
			__private = BlocksUtils.__get__('__private');
			done();
		});

		describe('library', function () {

			it('should assign logger', function () {
				expect(library.logger).to.eql(loggerStub);
			});

			it('should assign db', function () {
				expect(library.db).to.eql(dbStub);
			});

			it('should assign dbSequence', function () {
				expect(library.dbSequence).to.eql(modulesLoader.scope.dbSequence);
			});

			describe('should assign logic', function () {

				it('should assign block', function () {
					expect(library.logic.block).to.eql(blockStub);
				});

				it('should assign transaction', function () {
					expect(library.logic.transaction).to.eql(transactionStub);
				});
			});
		});

		it('should call library.logger.trace with "Blocks->Utils: Submodule initialized."', function () {
			expect(loggerStub.trace.args[0][0]).to.equal('Blocks->Utils: Submodule initialized.');
		});
	});

	describe('onBind', function () {

		var modulesStub;
		var modules;

		before(function () {
			modulesStub = {
				blocks: {
					lastBlock: {
						get: sinonSandbox.stub().returns({id: '9314232245035524467', height: 1}),
						set: sinonSandbox.stub().returns({id: '9314232245035524467', height: 1})
					},
					utils: {
						readDbRows: blocksUtilsModule.readDbRows
					}
				}
			};
			loggerStub.trace.reset();
			__private.loaded = false;

			blocksUtilsModule.onBind(modulesStub);
			modules = BlocksUtils.__get__('modules');
		});

		it('should call library.logger.trace with "Blocks->Utils: Shared modules bind."', function () {
			expect(loggerStub.trace.args[0][0]).to.equal('Blocks->Utils: Shared modules bind.');
		});

		it('should create a modules object { blocks: scope.blocks }', function () {
			expect(modules.blocks).to.equal(modulesStub.blocks);
		});

		it('should set __private.loaded to true', function () {
			expect(__private.loaded).to.be.true;
		});
	});

	describe('readDbRows', function () {

		it('should transform a full_blocks_list view row into a block object', function (done) {
			var blockObject = blocksUtilsModule.readDbRows(viewRow_full_blocks_list);

			expect(blockObject[0].id).to.equal(viewRow_full_blocks_list[0].b_id);
			expect(blockObject[0].height).to.equal(viewRow_full_blocks_list[0].b_height);
			expect(blockObject[0].transactions[0].id).to.equal(viewRow_full_blocks_list[0].t_id);
			expect(blockObject[0].transactions[0].type).to.equal(viewRow_full_blocks_list[0].t_type);
			done();
		});
	});

	describe('loadBlocksPart', function () {

		describe('when there is no error when loading block array', function () {

			it('should be normalized');

			it('should call callback with error = undefined');

			it('should call callback with blocks as result');
		});

		describe('when error is defined', function () {

			it('should call callback with the error object');

			it('should call callback with blocks as result');
		});
	});

	describe('loadLastBlock', function () {

		it('should call library.dbSequence.add');

		it('should call library.db.query to load the last block');

		describe('when db query fails', function () {

			it('should call logger.error with error stack');

			it('should call callback with the Blocks#loadLastBlock error');
		});

		describe('when db.query succeeds', function () {

			describe('sorting the block.transactions array', function () {

				describe('when block.id equals genesis.block.id', function () {

					describe('and transactionType equals VOTE', function () {

						it('should move it to the end of the block array');
					});
				});

				describe('when transactionType equals SIGNATURE', function () {

					it('should move it to the end of the block.transactions array');
				});
			});

			it('should call modules.blocks.lastBlock.set with block');

			it('should call callback with error = null');

			it('should call callback with result containing the block');
		});
	});

	describe('getIdSequence', function () {

		it('should call modules.blocks.lastBlock.get');

		it('should call library.db.query');

		it('should call library.db.query with sql.getIdSequence');

		it('should call library.db.query with {height: height, limit: 5, delegates: constants.activeDelegates}');

		describe('when db query fails', function () {

			it('should call logger.error with error stack');

			it('should call callback with the Blocks#getIdSequence error');
		});

		describe('when db query succeeds', function () {

			describe('and returns no results', function () {

				it('should call callback with an error');
			});

			it('should add the genesis block to the end of the block array, if it does not contain it already');

			it('should add the last block to the beginning of the block array, if it does not contain it already');

			it('should call callback with error = null');

			describe('result object', function () {

				it('should assign firstHeight to the height of the last block');

				it('should assign ids to a string of the block ids');
			});

			it('should call callback with result object');
		});
	});

	describe('loadBlocksData', function () {

		describe('when 3 parameters are passed to loadBlocksData', function () {

			it('should call third parameter');
		});

		describe('when 2 parameters are passed to loadBlocksData', function () {

			it('should call second parameter');
		});

		describe('when filter.id and filter.lastId are defined',function () {

			it('should call callback with Invalid Filter error');
		});

		describe('when filter.lastId is undefined and filter.id is defined', function () {

			it('should set params.id to filter.id');
		});

		describe('when filter.id is undefined and filter.lastId is defined', function () {

			it('should set params.lastId to filter.lastId');
		});

		it('should call library.dbSequence.add');

		it('should call library.db.query');

		it('should call library.db.blocks.getHeightByLastId');

		describe('when filter.lastId exists', function () {

		   it('should call library.db.query with {lastId: filter.lastId}');
		});

		describe('when filter.lastId does not exist', function () {

		   it('should call library.db.query with {lastId: null}');
		});

		describe('when db query fails', function () {

			it('should call logger.error with error stack');

			it('should call callback with the Blocks#loadBlockData error');
		});

		describe('when db query succeeds', function () {

			describe('and does not return results', function () {

				it('should set height to 0');
			});

			describe('and returns results', function () {

				it('should set height to rows[0].height');
			});

			it('should set params.limit to realLimit');

			it('should set params.height to height');

			it('should call library.db.query');

			it('should call library.db.query with sql.loadBlocksData with filter');

			it('should call library.db.query with params)');

			describe('when db query succeeds', function () {

				it('should call callback with error = null');

				it('should call callback with result containing the rows');
			});
		});
	});

	describe('getBlockProgressLogger', function () {

		describe('BlockProgressLogger', function () {

			it('should set this.target to transactionsCount');

			it('should set this.step to Math.floor(transactionsCount / logsFrequency);');

			it('should set this.applied to 0');

			describe('reset function', function () {

				it('should set this.applied to 0');
			});

			describe('applyNext function', function () {

				describe('when this.applied >= this.target', function () {

					it('should throw error');
				});

				it('should increment this.applied');

				describe('when this.applied = 1', function () {

					it('should call this.log');
				});

				describe('when this.applied = this.target', function () {

					it('should call this.log');
				});

				describe('when this.applied %this.step = 1', function () {

					it('should call this.log');
				});
			});

			describe('log function', function () {

				it('should call library.logger.info with msg');

				it('should call library.logger.info with message');
			});
		});

		it('should return a new instance of BlockProgressLogger');
	});
});
