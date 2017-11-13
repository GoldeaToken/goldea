var IssuedToken = artifacts.require("./token/IssuedToken.sol");
var PreSale = artifacts.require("./sale/PreSale.sol");
var PriceCalculator = artifacts.require("./sale/PriceCalculator.sol");

contract("PreSale", accounts => {
    it("should sell tokens for ether", async () => {
        var token = await IssuedToken.new("TEST", "TST", 10**15, 0);
        var calculator = await PriceCalculator.new(10);
        var sale = await PreSale.new(token.address, calculator.address);

        await token.approve(sale.address, await token.totalSupply.call());

        await sale.buyTokens({from: accounts[1], value: 10**13});
        assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 10**12);
    });

    it("should throw if user buying less than minimalTokens", async () => {
        var token = await IssuedToken.new("TEST", "TST", 10**15, 0);
        var calculator = await PriceCalculator.new(10);
        var sale = await PreSale.new(token.address, calculator.address);

        await token.approve(sale.address, await token.totalSupply.call());
        await sale.setMinimalTokens(1000);

        await sale.buyTokens({from: accounts[1], value: 10000});
        try {
            await sale.buyTokens({from: accounts[1], value: 100});
        } catch (e) {
            return;
        }
        assert(false, "should throw because less than 1000 tokens");
    });
});