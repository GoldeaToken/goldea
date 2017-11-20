var GoldeaSale = artifacts.require("./goldea/GoldeaSale.sol");
var GoldeaToken = artifacts.require("./goldea/GoldeaToken.sol");
var IssuedToken = artifacts.require("./token/IssuedToken.sol");
const tests = require("daonomic-tests");

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

  it("should not sell when paused", async () => {
    await token.transfer(testing.address, bn("200000000000"));

    await testing.pause();
    await tests.expectThrow(
      testing.sendTransaction({value: bn("3750000000000001"), from: accounts[1]})
    );

    await tests.expectThrow(
      testing.onTokenTransfer(accounts[2], 1, "", {from: accounts[9]})
    );
  });

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
    await testing.changeParameters(bn("2666666666"), bn("593333333333333333333"), 15);

    await assertEqual(testing.getAmount(0, bn('3750000000000001')), 11499999);
    await assertEqual(testing.getAmount(accounts[9], bn('100000000')), 68233333333);

    await assertEqual(testing.getAmount(0, bn('156250000000000000000000')), 479166666546875);
    await assertEqual(testing.getAmount(accounts[9], bn('700000000000')), 477633333333333);

    await assertEqual(testing.getAmount(0, bn('326086957')), 1);
    await assertEqual(testing.getAmount(0, bn('326086956')), 0);
    await assertEqual(testing.getAmount(accounts[9], bn('1')), 682);
  });

  it("should sell tokens for ETH and withdraw ETH", async () => {
    await token.transfer(testing.address, bn("200000000000"));

    await testing.sendTransaction({value: bn("3750000000000001"), from: accounts[1]});
    await assertEqual(await web3.eth.getBalance(testing.address), 3750000000000001);
    await assertEqual(token.balanceOf(accounts[1]), 9999999);
    var before = (await web3.eth.getBalance(accounts[8])).toNumber();
    await testing.withdraw(0, accounts[8], bn("3750000000000001"));
    await assertEqual(await web3.eth.getBalance(accounts[8]), before + 3750000000000001);
    await assertEqual(await web3.eth.getBalance(testing.address), 0);
  });

  it("should sell tokens for other tokens (BTC)", async () => {
    await token.transfer(testing.address, bn("200000000000"));
    await testing.pause();
    await testing.unpause();

    //emulate onTokenTransfer from BTC token
    await testing.onTokenTransfer(accounts[2], 1, "", {from: accounts[9]});
    await assertEqual(token.balanceOf(accounts[2]), 593);
  });

  it("should not sell tokens for other tokens", async () => {
    await token.transfer(testing.address, bn("200000000000"));

    await tests.expectThrow(
        testing.onTokenTransfer(accounts[2], 1, "")
    );
  });

  it("should send tokens to other address if specified", async () => {
    await token.transfer(testing.address, bn("200000000000"));

    await testing.onTokenTransfer(accounts[2], 1, accounts[3], {from: accounts[9]});
    await assertEqual(token.balanceOf(accounts[3]), 593);
  });

  it("should let withdraw any token", async () => {
    var temp = await IssuedToken.new("TEST", "TST", 1000, 0);
    await temp.transfer(testing.address, 1000);

    await assertEqual(temp.balanceOf(accounts[8]), 0);
    await testing.withdraw(temp.address, accounts[8], 1000);
    await assertEqual(temp.balanceOf(accounts[8]), 1000);
  });

  it("should deny GoldeaToken withdraw", async () => {
    await token.transfer(testing.address, bn("200000000000"));

    await tests.expectThrow(
      testing.withdraw(token.address, accounts[8], 1000)
    );
  });

  it("should turn off sale on endDate and burn rest", async () => {
    await token.transfer(testing.address, bn("200000000000"));

    await tests.expectThrow(
      testing.burn()
    );

    var diff = Math.round((Date.parse("2018-04-01T00:00:00.000Z") - new Date().getTime()) / 1000);
    await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [diff - 100], id: 0});

    await testing.sendTransaction({value: bn("3750000000000001"), from: accounts[4]});
    await assertEqual(token.balanceOf(accounts[4]), 9999999);

    await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [200], id: 0});
    await tests.expectThrow(
      testing.sendTransaction({value: bn("3750000000000001"), from: accounts[4]})
    );

    await assertEqual(token.balanceOf(testing.address), 199990000001);
    await testing.burn();
    await assertEqual(token.balanceOf(testing.address), 0);
  })
});


