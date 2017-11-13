pragma solidity ^0.4.11;


import "../math/SafeMath.sol";
import "../ownership/Ownable.sol";
import "../sale/Calculator.sol";


contract PriceCalculator is Calculator, Ownable {
    using SafeMath for uint256;

    uint256 public price;

    function PriceCalculator(uint256 _price) public {
        price = _price;
    }

    function getAmount(uint value) constant public returns (uint) {
        return value.div(price);
    }

    function setPrice(uint256 _price) onlyOwner public {
        price = _price;
    }
}