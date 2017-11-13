var GoldeaSale = artifacts.require("./goldea/GoldeaSale.sol");
var GoldeaToken = artifacts.require("./goldea/GoldeaToken.sol");

const expectThrow = require("./helpers/expectThrow.js");

contract("GoldeaSale", function(accounts) {
    let testing;
    let token;
    beforeEach(async function() {
        token = await GoldeaToken.deployed();
        testing = await GoldeaSale.new(token.address, accounts[9]);
        await testing.changeParameters(bn("2666666666"), bn("593333333333333333333"), 0);
    });

    async function assertEqual(promise, test) {
        assert.equal((await promise).toNumber(), test);
    }

    function bn(value) {
        return new web3.BigNumber(value);
    }

    it("should calculate amount", async () => {
        await assertEqual(testing.getAmount(0, bn('3750000000000000')), 9999999);
        await assertEqual(testing.getAmount(accounts[9], bn('100000000')), 59333333333);

        await assertEqual(testing.getAmount(0, bn('156250000000000000000000')), 416666666562500);
        await assertEqual(testing.getAmount(accounts[9], bn('700000000000')), 415333333333333);

        await assertEqual(testing.getAmount(0, bn('375000001')), 1);
        await assertEqual(testing.getAmount(0, bn('375000000')), 0);
        await assertEqual(testing.getAmount(accounts[9], bn('1')), 593);
    });

    it("should calculate amount using bonus", async () => {
        await testing.setBonus(15);

        await assertEqual(testing.getAmount(0, bn('3750000000000001')), 11499999);
        await assertEqual(testing.getAmount(accounts[9], bn('100000000')), 68233333333);

        await assertEqual(testing.getAmount(0, bn('156250000000000000000000')), 479166666546875);
        await assertEqual(testing.getAmount(accounts[9], bn('700000000000')), 477633333333333);

        await assertEqual(testing.getAmount(0, bn('326086957')), 1);
        await assertEqual(testing.getAmount(0, bn('326086956')), 0);
        await assertEqual(testing.getAmount(accounts[9], bn('1')), 682);
    });

    it("should sell tokens for ETH", async () => {
        await token.approve(testing.address, bn("200000000000000"));

        await testing.sendTransaction({value: bn("3750000000000001"), from: accounts[1]});
        await assertEqual(token.balanceOf(accounts[1]), 9999999);
    });

    it("should sell tokens for other tokens (BTC)", async () => {
        await token.approve(testing.address, bn("200000000000000"));

        await testing.onTokenTransfer(accounts[2], 1, "", {from: accounts[9]});
        await assertEqual(token.balanceOf(accounts[2]), 593);
    });

    it("should not sell tokens for other tokens", async () => {
        await token.approve(testing.address, bn("200000000000000"));

        await expectThrow(
            testing.onTokenTransfer(accounts[2], 1, "")
        );
    });

    it("should send tokens to other address if specified", async () => {
        await token.approve(testing.address, bn("200000000000000"));

        await testing.onTokenTransfer(accounts[2], 1, accounts[3], {from: accounts[9]});
        await assertEqual(token.balanceOf(accounts[3]), 593);
    });
});


