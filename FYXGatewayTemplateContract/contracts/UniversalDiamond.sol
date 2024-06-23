// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import {SolidStateDiamond} from "@solidstate/contracts/proxy/diamond/SolidStateDiamond.sol";

/**
 * @title UniversalDiamond "Diamond" proxy implementation based on SolidState Diamond Reference
 */
contract UniversalDiamond is SolidStateDiamond {
    string public name = "Universal";
}
