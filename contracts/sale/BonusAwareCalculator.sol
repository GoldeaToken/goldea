pragma solidity ^0.4.11;


import "./Calculator.sol";
import "./BonusCalculator.sol";


contract BonusAwareCalculator is Calculator {
    Calculator delegate;

    BonusCalculator bonusCalculator;

    function BonusAwareCalculator(address delegateAddress, address bonusCalculatorAddress) public {
        delegate = Calculator(delegateAddress);
        bonusCalculator = BonusCalculator(bonusCalculatorAddress);
    }

    function getAmount(uint value) constant public returns (uint) {
        uint withoutBonus = delegate.getAmount(value);
        uint bonusPercent = bonusCalculator.getBonus();
        uint bonus = withoutBonus * bonusPercent / 100;
        return withoutBonus + bonus;
    }
}
