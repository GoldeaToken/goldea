pragma solidity ^0.4.18;


import "../ownership/Ownable.sol";
import "../token/ERC20.sol";


contract GoldeaBounty is Ownable {
    ERC20 public token;

    function GoldeaBounty(ERC20 _token) public {
        token = _token;
    }

    function transfer(address beneficiary, uint256 amount) onlyOwner public {
        token.transfer(beneficiary, amount);
    }
}
