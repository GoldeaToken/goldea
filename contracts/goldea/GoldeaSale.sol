pragma solidity ^0.4.15;


import "../sale/Sale.sol";
import "../token/BurnableToken.sol";


contract GoldeaSale is Sale {
    address public btcToken;
    uint256 public constant end = 1522540800;
    uint256 public constant total = 200000000000000;

    function GoldeaSale(address _token, address _btcToken) Sale(_token) public {
        btcToken = _btcToken;
    }

    function changeParameters(uint256 _ethRate, uint256 _btcRate, uint256 _bonus) onlyOwner public {
        setRate(address(0), _ethRate);
        setRate(btcToken, _btcRate);
        setBonus(_bonus);
    }

    function setBtcToken(address _btcToken) onlyOwner public {
        btcToken = _btcToken;
    }

    function doPurchase(address buyer, uint256 amount) internal {
        require(now < end);
        super.doPurchase(buyer, amount);
    }

    function burn() onlyOwner public {
        require(now >= end);
        BurnableToken(token).burn(token.balanceOf(this));
    }
}
