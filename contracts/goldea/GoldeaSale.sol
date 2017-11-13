pragma solidity ^0.4.15;


import "../sale/Sale.sol";


contract GoldeaSale is Sale {
    address btcToken;

    function GoldeaSale(address _token, address _btcToken) Sale(_token) public {
        btcToken = _btcToken;
    }

    function changeParameters(uint256 _ethRate, uint256 _btcRate, uint256 _bonus) onlyOwner public {
        setRate(address(0), _ethRate);
        setRate(btcToken, _btcRate);
        setBonus(_bonus);
    }
}
