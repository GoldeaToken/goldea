pragma solidity ^0.4.11;

import '../ownership/Ownable.sol';
import '../token/ERC20.sol';
import './Calculator.sol';

/**
 * @title Sale contract. Can sell someone's tokens
 */
contract Sale is Ownable {

    //responsible for getting token amount
    Calculator calculator;

    //which token should we sell
    ERC20 token;

    // who sells his tokens
    address tokenSeller;

    uint256 public minimalTokens = 100000000000;

    /**
     * event for token purchase logging
     * @param purchaser who paid for the tokens
     * @param value weis paid for purchase
     * @param amount amount of tokens purchased
     */
    event TokenPurchase(address indexed purchaser, uint256 value, uint256 amount);

    function Sale(address tokenAddress, address calculatorAddress) {
        tokenSeller = msg.sender;
        token = ERC20(tokenAddress);
        setCalculatorAddress(calculatorAddress);
    }

    function () payable {
        buyTokens();
    }

    function buyTokens() payable {
        uint256 weiAmount = msg.value;

        // calculate token amount to be created
        uint256 tokens = calculator.getAmount(weiAmount);
        assert(tokens >= minimalTokens);

        token.transferFrom(tokenSeller, msg.sender, tokens);
        TokenPurchase(msg.sender, weiAmount, tokens);
    }

    function setTokenSeller(address newTokenSeller) onlyOwner {
        tokenSeller = newTokenSeller;
    }

    function setCalculatorAddress(address calculatorAddress) onlyOwner {
        calculator = Calculator(calculatorAddress);
    }

    function setMinimalTokens(uint256 _minimalTokens) onlyOwner {
        minimalTokens = _minimalTokens;
    }

    function withdraw(address beneficiary, uint amount) onlyOwner {
        require(beneficiary != 0x0);

        beneficiary.transfer(amount);
    }
}