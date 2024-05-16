//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {console} from "forge-std/console.sol";

import {ScaffoldETHDeploy} from "./DeployHelpers.s.sol";
import {ReputationTokens} from "@atxdao/contracts/reputation/ReputationTokens.sol";
import {IReputationTokensTypes} from "@atxdao/contracts/reputation/IReputationTokensTypes.sol";
import {Hats} from "../contracts/Hats/Hats.sol";
import {MultiClaimsHatter} from "../contracts/MultiClaimsHatter.sol";
import {ERC1155EligibiltiyModule} from "../contracts/ERC1155EligibiltiyModule.sol";
import {ActiveModule} from "../contracts/ActiveModule.sol";
import {ReputationFaucet} from "../contracts/Reputation/ReputationFaucet.sol";

contract DeployATXDAOScript is ScaffoldETHDeploy {
    error InvalidPrivateKey(string);

    address controller = 0xc689c800a7121b186208ea3b182fAb2671B337E7; //replace with burner or other address from wallet!

    function run() external {
        uint256 deployerPrivateKey = setupLocalhostEnv();
        if (deployerPrivateKey == 0) {
            revert InvalidPrivateKey(
                "You don't have a deployer account. Make sure you have set DEPLOYER_PRIVATE_KEY in .env or use `yarn generate` to generate a new random account"
            );
        }

        vm.startBroadcast(deployerPrivateKey);

        address deployerPubKey = vm.createWallet(deployerPrivateKey).addr;

        address[] memory admins = new address[](2);
        admins[0] = deployerPubKey;
        admins[1] = controller;

        ReputationTokens instance = new ReputationTokens(controller, admins);

        setupAccountWithAllRoles(instance, deployerPubKey);

        batchCreateTokens(instance);

        batchSetTokenURIs(instance);

        instance.revokeRole(instance.TOKEN_UPDATER_ROLE(), deployerPubKey);
        instance.revokeRole(instance.TOKEN_URI_SETTER_ROLE(), deployerPubKey);
        instance.revokeRole(instance.DEFAULT_ADMIN_ROLE(), deployerPubKey);

        vm.stopBroadcast();
    }

    ///////////////////////////////////
    // HELPER FUNCTIONS
    ///////////////////////////////////

    function setupAccountWithAllRoles(ReputationTokens instance, address addr) public {
        instance.grantRole(instance.TOKEN_UPDATER_ROLE(), addr);
        instance.grantRole(instance.TOKEN_URI_SETTER_ROLE(), addr);
    }

    function batchCreateTokens(ReputationTokens instance) public {
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = 0;
        tokenIds[1] = 1;

        IReputationTokensTypes.TokenType[] memory tokenTypes = new IReputationTokensTypes.TokenType[](2);
        tokenTypes[0] = IReputationTokensTypes.TokenType.Soulbound;
        tokenTypes[1] = IReputationTokensTypes.TokenType.Redeemable;

        instance.updateTokenBatch(tokenIds, tokenTypes);
    }

    function batchSetTokenURIs(ReputationTokens instance) public {
        string memory BASE_URI = "ipfs://bafybeiaz55w6kf7ar2g5vzikfbft2qoexknstfouu524l7q3mliutns2u4/";

        instance.setTokenURI(0, string.concat(BASE_URI, "0"));
        instance.setTokenURI(1, string.concat(BASE_URI, "1"));
    }
}
