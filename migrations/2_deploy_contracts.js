var GoldeaToken = artifacts.require("./goldea/GoldeaToken.sol");
var GoldeaBonusCalculator = artifacts.require("./goldea/GoldeaBonusCalculator.sol");
var PriceCalculator = artifacts.require("./sale/PriceCalculator.sol");
var BonusAwareCalculator = artifacts.require("./sale/BonusAwareCalculator.sol");
var PreSale = artifacts.require("./sale/PreSale.sol");

module.exports = deployer => {
    deployer.deploy(GoldeaToken, 300000000000000)
        .then(() => deployer.deploy(PriceCalculator, 180000000))
        .then(() => deployer.deploy(GoldeaBonusCalculator, 1505001600, 1507593600))
        .then(() => deployer.deploy(BonusAwareCalculator, PriceCalculator.address, GoldeaBonusCalculator.address))
        .then(() => deployer.deploy(PreSale, GoldeaToken.address, BonusAwareCalculator.address));
};
