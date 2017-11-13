pragma solidity ^0.4.15;


import "../ownership/Ownable.sol";


/**
 * @title Month and week calculator
 * @dev Is not used cause need too much gas
 */
contract GoldeaPeriod is Ownable {
    uint256[16] public periods;
    uint256 public end;
    uint256 public diff;

    function GoldeaPeriod() public {
        periods[0] = 1510704000;//15.11.2017
        periods[1] = 1511308800;//22.11.2017
        periods[2] = 1511913600;//29.11.2017
        periods[3] = 1512518400;//06.12.2017
        periods[4] = 1513296000;//15.12.2017
        periods[5] = 1513900800;//22.12.2017
        periods[6] = 1514505600;//29.12.2017
        periods[7] = 1515110400;//05.01.2018
        periods[8] = 1515974400;//15.01.2018
        periods[9] = 1516579200;//22.01.2018
        periods[10] = 1517184000;//29.01.2018
        periods[11] = 1517875200;//06.02.2018
        periods[12] = 1518652800;//15.02.2018
        periods[13] = 1519257600;//22.02.2018
        periods[14] = 1519862400;//01.03.2018
        periods[15] = 1520467200;//08.03.2018
        end = 1521072000;//15.03.2018
    }

    function getPeriodExternal(uint256 _timestamp) external constant returns (uint8, uint8) {
        return getPeriod(_timestamp);
    }

    function getPeriod(uint256 _timestamp) internal constant returns (uint8, uint8) {
        require(_timestamp < end);
        require(_timestamp >= periods[0]);
        uint8 num = 15;
        for (uint8 i = 1; i < 16; i++) {
            if (_timestamp < periods[i]) {
                num = i - 1;
                break;
            }
        }
        return (num / 4, num % 4);
    }
}
