/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { VendaDeCarrosContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('VendaDeCarrosContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new VendaDeCarrosContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"venda de carros 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"venda de carros 1002 value"}'));
    });

    describe('#vendaDeCarrosExists', () => {

        it('should return true for a venda de carros', async () => {
            await contract.vendaDeCarrosExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a venda de carros that does not exist', async () => {
            await contract.vendaDeCarrosExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createVendaDeCarros', () => {

        it('should create a venda de carros', async () => {
            await contract.createVendaDeCarros(ctx, '1003', 'venda de carros 1003 value', 'preto');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"venda de carros 1003 value"}'));
        });

        it('should throw an error for a venda de carros that already exists', async () => {
            await contract.createVendaDeCarros(ctx, '1001', 'myvalue').should.be.rejectedWith(/The venda de carros 1001 already exists/);
        });

    });

    describe('#readVendaDeCarros', () => {

        it('should return a venda de carros', async () => {
            await contract.readVendaDeCarros(ctx, '1001').should.eventually.deep.equal({ value: 'venda de carros 1001 value' });
        });

        it('should throw an error for a venda de carros that does not exist', async () => {
            await contract.readVendaDeCarros(ctx, '1003').should.be.rejectedWith(/The venda de carros 1003 does not exist/);
        });

    });

    describe('#updateVendaDeCarros', () => {

        it('should update a venda de carros', async () => {
            await contract.updateVendaDeCarros(ctx, '1001', 'venda de carros 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"venda de carros 1001 new value"}'));
        });

        it('should throw an error for a venda de carros that does not exist', async () => {
            await contract.updateVendaDeCarros(ctx, '1003', 'venda de carros 1003 new value').should.be.rejectedWith(/The venda de carros 1003 does not exist/);
        });

    });

    describe('#deleteVendaDeCarros', () => {

        it('should delete a venda de carros', async () => {
            await contract.deleteVendaDeCarros(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a venda de carros that does not exist', async () => {
            await contract.deleteVendaDeCarros(ctx, '1003').should.be.rejectedWith(/The venda de carros 1003 does not exist/);
        });

    });

});