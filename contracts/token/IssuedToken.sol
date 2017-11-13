pragma solidity ^0.4.11;

import "../token/StandardToken.sol";
import "../token/BurnableToken.sol";

contract IssuedToken is StandardToken {
    string public name;
    string public symbol;
    uint public decimals;

    function IssuedToken(string _name, string _symbol, uint _totalSupply, uint _decimals) public {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply;
        decimals = _decimals;

        balances[msg.sender] = _totalSupply;
    }
}