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

    /**
     * @dev It should not let owners transfer tokens to protect investors
     */
    function verifyCanWithdraw(address _token, address _to, uint256 _amount) internal {
        require(_token != address(token));
    }
}