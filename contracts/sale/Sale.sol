pragma solidity ^0.4.11;


import './AbstractSale.sol';
import '../token/ERC20.sol';


/**
 * @dev Sells someone's tokens. Can accept ether or any token
 */
contract Sale is AbstractSale {
    ERC20 public token;

    function Sale(address _token) public {
        token = ERC20(_token);
    }

    function doPurchase(address buyer, uint256 amount) internal {
        token.transfer(buyer, amount);
    }

    function calculateTotal() constant public returns (uint256) {
        return token.balanceOf(this);
    }
}