pragma solidity ^0.4.11;

import '../ownership/Ownable.sol';
import '../token/ERC20.sol';
import './Calculator.sol';

/**
 * @title Sale contract. Can sell someone's tokens
 */
contract PreSale is Ownable {

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

    function PreSale(address tokenAddress, address calculatorAddress) public {
        tokenSeller = msg.sender;
        token = ERC20(tokenAddress);
        setCalculatorAddress(calculatorAddress);
    }

    function () payable public {
        buyTokens();
    }

    function buyTokens() payable public {
        uint256 weiAmount = msg.value;

        // calculate token amount to be created
        uint256 tokens = calculator.getAmount(weiAmount);
        assert(tokens >= minimalTokens);

        token.transferFrom(tokenSeller, msg.sender, tokens);
        TokenPurchase(msg.sender, weiAmount, tokens);
    }

    function setTokenSeller(address newTokenSeller) onlyOwner public {
        tokenSeller = newTokenSeller;
    }

    function setCalculatorAddress(address calculatorAddress) onlyOwner public {
        calculator = Calculator(calculatorAddress);
    }

    function setMinimalTokens(uint256 _minimalTokens) onlyOwner public {
        minimalTokens = _minimalTokens;
    }

    function withdraw(address beneficiary, uint amount) onlyOwner public {
        require(beneficiary != 0x0);

        beneficiary.transfer(amount);
    }
}