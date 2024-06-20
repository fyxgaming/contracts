// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import {SolidStateDiamond} from "@solidstate/contracts/proxy/diamond/SolidStateDiamond.sol";

/**
 * @title OmniscapeDiamond "Diamond" proxy implementation based on SolidState Diamond Reference
 */
contract OmniscapeDiamond is SolidStateDiamond {
    string public name = "Omniscape";
}
