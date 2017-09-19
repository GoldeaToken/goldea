pragma solidity ^0.4.11;

import "../token/IssuedToken.sol";
import "../token/BurnableToken.sol";

contract GoldeaToken is IssuedToken, BurnableToken {
    function GoldeaToken(uint256 _totalSupply) IssuedToken("GOLDEA", "GEA", _totalSupply, 8) {
    }
}