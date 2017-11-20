var GoldeaBounty = artifacts.require("GoldeaBounty.sol");
var GoldeaToken = artifacts.require("./goldea/GoldeaToken.sol");
const tests = require("daonomic-tests");

contract("GoldeaBounty", accounts => {
    let testing;
    let token;

    beforeEach(async function() {
        token = await GoldeaToken.deployed();
        testing = await GoldeaBounty.new(token.address);
        token.transfer(testing.address, 100);
    });

    it("should send bounty to beneficiary", async () => {
        var address = tests.randomAddress();
        await testing.transfer(address, 20);
        assert.equal(await token.balanceOf(address), 20);
        assert.equal(await token.balanceOf(testing.address), 80);
    });

    it("should throw if not owner", async () => {
        await tests.expectThrow(
            testing.transfer(tests.randomAddress(), 20, {from: accounts[1]})
        );
    });
});