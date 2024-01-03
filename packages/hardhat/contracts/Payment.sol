// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface INFTContract {
	function ownerOf(uint256 tokenId) external view returns (address);
}

contract Payment is Ownable {
	INFTContract public nftContract;

	constructor(address _owner, address _nftContractAddress) Ownable(_owner) {
		nftContract = INFTContract(_nftContractAddress);
	}

	function payOwnerOfNFT(uint256 tokenId) external payable {
		require(msg.value > 0, "No payment sent");
		address nftOwner = nftContract.ownerOf(tokenId);
		require(nftOwner != address(0), "NFT owner not found");

		(bool sent, ) = nftOwner.call{ value: msg.value }("");
		require(sent, "Failed to send Ether");
	}
}
