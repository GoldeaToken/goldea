pragma solidity ^0.4.15;


import "../sale/Sale.sol";


/**
 * 1. Цены - Считаются так: Базовая цена. Есть 4 базовые цены с началом дат. 12, 15, 18, 21
 *    для получения цены по токену нужно взять базовую цену, с учетом курса
 * 2. Бонусы
 * @dev Basic version of StandardToken, with no allowances.
 */
contract GoldeaSale is Sale {
    address btcToken;

    function GoldeaSale(address _token, address _btcToken) Sale(_token) public {
        btcToken = _btcToken;
    }

    function changeParameters(uint256 _ethRate, uint256 _btcRate, uint256 _bonus) onlyOwner public {
        setRate(address(0), _ethRate);
        setRate(btcToken, _btcRate);
        setBonus(_bonus);
    }
}
