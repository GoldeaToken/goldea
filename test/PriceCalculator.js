var PriceCalculator = artifacts.require("./sale/PriceCalculator.sol");

contract("PriceCalculator", accounts => {
    it("should calculate according price", async () => {
        var calculator = await PriceCalculator.new(180000000);

        assert.equal((await calculator.getAmount(web3.toWei(1800, "micro"))).toNumber(), 10000000);
        assert.equal((await calculator.getAmount(web3.toWei(9, "finney"))).toNumber(), 50000000);
        assert.equal((await calculator.getAmount(web3.toWei(18, "finney"))).toNumber(), 100000000);
    });
});