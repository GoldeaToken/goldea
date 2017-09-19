var GoldeaToken = artifacts.require("./goldea/GoldeaToken.sol");
var GoldeaBonusCalculator = artifacts.require("./goldea/GoldeaBonusCalculator.sol");
var PriceCalculator = artifacts.require("./sale/PriceCalculator.sol");
var Sale = artifacts.require("./sale/Sale.sol");

describe("Integration Test", async () => {
    var now = parseInt(new Date().getTime() / 1000)
    var accounts = web3.eth.accounts;
    var token;
    var bonusCalculator;
    var priceCalculator;
    var sale;

    it("Sale should sell tokens for ether", async () => {
        token = await GoldeaToken.deployed();
        bonusCalculator = await GoldeaBonusCalculator.deployed();
        sale = await Sale.deployed();
        priceCalculator = await PriceCalculator.deployed();
        await priceCalculator.setPrice(100);

        await token.approve(sale.address, await token.totalSupply.call());
        await bonusCalculator.setStart(now - 1000);

        var tokensBefore = (await token.balanceOf.call(accounts[1])).toNumber();
        await sale.buyTokens({from: accounts[1], value: 1000 * 10**12});
        assert.equal((await token.balanceOf.call(accounts[1])).toNumber() - tokensBefore, 13 * 10**12);
    });

    it("Sale contract should send ether to beneficiary", async () => {
        var balanceBefore = web3.eth.getBalance(accounts[2]).toNumber();
        await sale.withdraw(accounts[2], 1000 * 10**12);
        assert.equal(web3.eth.getBalance(accounts[2]).toNumber() - balanceBefore, 1000 * 10**12);
    });

    //todo проверить, что после и до нельзя купить
    //todo 1000 ограничение
    //todo проверить, что только owner может некоторые действия выполнять
});