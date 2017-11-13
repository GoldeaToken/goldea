var GoldeaBonusCalculator = artifacts.require("./goldea/GoldeaBonusCalculator.sol");

contract("GoldeaBonusCalculator", accounts => {
    it("should return 30% bonus for start date", async () => {
        var now = parseInt(new Date().getTime() / 1000)
        var calculator = await GoldeaBonusCalculator.new(now - 1000, now + 86400 * 30);
        assert.equal((await calculator.getBonus.call()).toNumber(), 30);
    });

    it("should return 30% bonus for the end of the first week", async () => {
        var now = parseInt(new Date().getTime() / 1000)
        var calculator = await GoldeaBonusCalculator.new(now - (86400 * 7) + 1000, now + 86400 * 30);
        assert.equal((await calculator.getBonus.call()).toNumber(), 30);
    });

    it("should return 20% bonus for the start of the second week", async () => {
        var now = parseInt(new Date().getTime() / 1000)
        var calculator = await GoldeaBonusCalculator.new(now - (86400 * 7) - 1000, now + 86400 * 30);
        assert.equal((await calculator.getBonus.call()).toNumber(), 20);
    });

    it("should return 5% bonus for the start of the fifth week", async () => {
        var now = parseInt(new Date().getTime() / 1000)
        var calculator = await GoldeaBonusCalculator.new(now - (86400 * 28) - 1000, now + 86400 * 30);
        assert.equal((await calculator.getBonus.call()).toNumber(), 5);
    });
});