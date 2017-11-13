var GoldeaPeriod = artifacts.require("./goldea/GoldeaPeriod.sol");

const expectThrow = require("./helpers/expectThrow.js");

contract("GoldeaPeriod", function(accounts) {
    let testing;
    beforeEach(async function() {
        testing = await GoldeaPeriod.new();
    });

    async function verifyPeriod(timestamp, month, week) {
        var arr = await testing.getPeriodExternal(timestamp);
        assert.equal(arr[0].toNumber(), month);
        assert.equal(arr[1].toNumber(), week);
    }

    it("should calculate periods", async () => {
        await expectThrow(
            testing.getPeriodExternal.call(1510703999)
        );
        await expectThrow(
            testing.getPeriodExternal.call(1521072000)
        );
        await verifyPeriod(1510704000, 0, 0);
        await verifyPeriod(1511308799, 0, 0);
        await verifyPeriod(1511308800, 0, 1);
        await verifyPeriod(1511913600, 0, 2);
        await verifyPeriod(1512518400, 0, 3);
        await verifyPeriod(1513296000, 1, 0);
        await verifyPeriod(1513900800, 1, 1);
        await verifyPeriod(1514505600, 1, 2);
        await verifyPeriod(1515110400, 1, 3);
        await verifyPeriod(1515974400, 2, 0);
        await verifyPeriod(1516579200, 2, 1);
        await verifyPeriod(1517184000, 2, 2);
        await verifyPeriod(1517875200, 2, 3);
        await verifyPeriod(1518652800, 3, 0);
        await verifyPeriod(1519257600, 3, 1);
        await verifyPeriod(1519862400, 3, 2);
        await verifyPeriod(1520467200, 3, 3);
        await verifyPeriod(1521071999, 3, 3);
    });
});


