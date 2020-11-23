/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class VendaDeCarrosContract extends Contract {

    async vendaDeCarrosExists(ctx, vendaDeCarrosId) {
        const buffer = await ctx.stub.getState(vendaDeCarrosId);
        return (!!buffer && buffer.length > 0);
    }

    async aluguelDeCarrosExists(ctx, aluguelDeCarrosId) {
        const buffer = await ctx.stub.getState(aluguelDeCarrosId);
        return (!!buffer && buffer.length > 0);
    }

    async createVendaDeCarros(ctx, vendaDeCarrosId, modelo, cor, anoDeLancamento, marca, preco) {//atributos do carro (valor Array)
        const exists = await this.vendaDeCarrosExists(ctx, vendaDeCarrosId);
        if (exists) {// verifica se existe o mesmo carro
            throw new Error(`The venda de carros ${vendaDeCarrosId} already exists`);
        }
        const asset = { modelo, cor, anoDeLancamento, marca, preco}; // criação do json (asset = carro)
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(vendaDeCarrosId, buffer);
    }

    async createAluguelDeCarros(ctx, aluguelDeCarrosId, modelo, cor, anoDeLancamento, marca, placa, precoDoAluguel, dataEmprestimo, dataDevolucao, periodo) {//atributos do carro (valor Array)
        const exists = await this.vendaDeCarrosExists(ctx, aluguelDeCarrosId);
        if (exists) {// verifica se existe o mesmo carro
            throw new Error(`The venda de carros ${aluguelDeCarrosId} already exists`);
        }
        const asset = { modelo, cor, anoDeLancamento, marca, placa, precoDoAluguel, dataEmprestimo, dataDevolucao, periodo}; // criação do json (asset = carro)
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(aluguelDeCarrosId, buffer);
    }

    async readVendaDeCarros(ctx, vendaDeCarrosId) {
        const exists = await this.vendaDeCarrosExists(ctx, vendaDeCarrosId);
        if (!exists) {
            throw new Error(`The venda de carros ${vendaDeCarrosId} does not exist`);
        }
        const buffer = await ctx.stub.getState(vendaDeCarrosId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async readAluguelDeCarros(ctx, vendaDeCarrosId) {
        const exists = await this.AluguelDeCarrosExists(ctx, aluguelDeCarrosId);
        if (!exists) {
            throw new Error(`The venda de carros ${aluguelDeCarrosId} does not exist`);
        }
        const buffer = await ctx.stub.getState(aluguelDeCarrosId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async AtualizarDadosDaVenda(ctx, vendaDeCarrosId, newCor, newPreco) {
        const exists = await this.vendaDeCarrosExists(ctx, vendaDeCarrosId);
        if (!exists) {
            throw new Error(`The venda de carros ${vendaDeCarrosId} does not exist`);
        }
        const asset = {
            cor: newCor,
            preco: newPreco
        };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(vendaDeCarrosId, buffer);
    }

    async AtualizarDadosDeAluguel(ctx, aluguelDeCarrosId, newCor, newPreco, newEmprestimo, newDevolucao, newPeriodo) {
        const exists = await this.aluguelDeCarrosExists(ctx, aluguelDeCarrosId);
        if (!exists) {
            throw new Error(`The venda de carros ${aluguelDeCarrosId} does not exist`);
        }
        const asset = {
            cor: newCor,
            precoDoAluguel: newPreco,
            dataEmprestimo: newEmprestimo,
            dataDevolucao: newDevolucao,
            periodo: newPeriodo
        };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(aluguelDeCarrosId, buffer);
    }

    async deleteVendaDeCarros(ctx, vendaDeCarrosId) {
        const exists = await this.vendaDeCarrosExists(ctx, vendaDeCarrosId);
        if (!exists) {
            throw new Error(`The venda de carros ${vendaDeCarrosId} does not exist`);
        }
        await ctx.stub.deleteState(vendaDeCarrosId);
    }

    async deleteAluguelDeCarros(ctx, aluguelDeCarrosId) {
        const exists = await this.vendaDeCarrosExists(ctx, aluguelDeCarrosId);
        if (!exists) {
            throw new Error(`The venda de carros ${aluguelDeCarrosId} does not exist`);
        }
        await ctx.stub.deleteState(aluguelDeCarrosId);
    }

}

module.exports = VendaDeCarrosContract;
