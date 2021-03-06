pragma solidity ^0.4.11;

import "../sale/BonusCalculator.sol";
import "../ownership/Ownable.sol";

contract GoldeaBonusCalculator is BonusCalculator, Ownable {
    uint public start;
    uint public end;
    uint constant period = 86400 * 7;
    mapping (uint => uint8) bonuses;

    function GoldeaBonusCalculator(uint256 _start, uint256 _end) public {
        start = _start;
        end = _end;
        bonuses[0] = 30;
        bonuses[1] = 20;
        bonuses[3] = 10;
    }

    function getBonus() constant public returns (uint) {
        assert(now > start);
        assert(now < end);

        uint week = (now - start) / period;
        uint8 foundBonus = bonuses[week];
        if (foundBonus != 0) {
            return foundBonus;
        } else {
            return 5;
        }
    }

    function setStart(uint256 _start) onlyOwner public {
        start = _start;
    }

    function setEnd(uint256 _end) onlyOwner public {
        end = _end;
    }
}
