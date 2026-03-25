// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract BatchCallDelegation {
    event CallExecuted(address indexed to, uint256 indexed value, bytes data, bool success);

    struct Call {
        bytes data;
        address to;
        uint256 value;
    }

    modifier onlySelf() {
        require(msg.sender == address(this), "BatchCallDelegation: caller is not the account itself");
        _;
    }

    receive() external payable {}

    fallback() external payable {}

    function execute(Call[] calldata calls) external payable onlySelf {
        require(calls.length > 0, "BatchCallDelegation: empty call list");

        for (uint256 i = 0; i < calls.length; i++) {
            Call memory call = calls[i];
            require(call.to != address(0), "BatchCallDelegation: call target is zero address");

            (bool success, ) = call.to.call{value: call.value}(call.data);
            require(success, "BatchCallDelegation: call reverted");

            emit CallExecuted(call.to, call.value, call.data, success);
        }
    }
}