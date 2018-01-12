var ProviderEngine = require("web3-provider-engine");
var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
var Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
var Web3 = require("web3");
var FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')
var Wallet = require("ethereumjs-wallet");

function createEngine(url, wallet) {
    var engine = new ProviderEngine();
    engine.addProvider(new WalletSubprovider(wallet, {}));
    engine.addProvider(new FilterSubprovider());
    engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(url)));
    engine.on('error', function(err) {
        console.error(err.stack)
    });
    return engine;
}

var config;
for(var i=0; i < process.argv.length; i++) {
    if (process.argv[i].startsWith("--config=")) {
        config = process.argv[i].substring(9);
    }
}

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

if (config && config.startsWith("~")) {
    config = getUserHome() + config.substring(1);
}
//var callback = function(err, res) {console.log(err ? err : res);}
//web3.eth.sendTransaction({from: "0x831244b8cce737b9844fcb13ec04e2bccc5a6e4a", to: "0x884ffccb29d5aba8c94509663595f1dbf823dcc9", value: "10000000000000000"}, callback);
module.exports = {
    networks: {},
    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
};

var networkConfig = {
    gas: 300000,
    gasPrice: 10000000000
};

if (config) {
    console.log("using config file: " + config);
    var json = require(config);
    var wallet = Wallet.fromPrivateKey(new Buffer(json.key, "hex"));
    var engine = createEngine(json.url, wallet);
    engine.start();
    networkConfig.from = wallet.getAddressString();
    console.log("address: " + wallet.getAddressString());
    networkConfig.network_id = json.network_id;
    networkConfig.provider = engine;

    module.exports.networks[json.name] = networkConfig;
}
