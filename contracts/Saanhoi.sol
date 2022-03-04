// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Saanhoi is ERC721,ERC721Enumerable,Pausable,Ownable{

    // TODO: STATUS, WHITELIST

    uint256 immutable public PRICE;
    uint256 immutable private _maxTotalSupply;

    string private _uri;

    constructor(string memory baseURI_) ERC721("Saanhoi","SA"){
        PRICE = 0.08 ether;
        _maxTotalSupply = 10000;
        _uri = baseURI_;
    }


    function maxTotalSupply() public view returns(uint256){
        return _maxTotalSupply;
    }

    // TODO: mint(nonReentrant)

    // TODO: whiteListMint(nonReentrant)

    /**
     *  manage URI
     *  TODO: Testing each one
     */
    
    function setURI(string memory baseURI_) public onlyOwner{
        _uri = baseURI_;
    }

    function _baseURI() override(ERC721) internal view returns (string memory){
        return _uri;
    }

    /** override */

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) override (ERC721,ERC721Enumerable) internal whenNotPaused{
        return super._beforeTokenTransfer(from,to,tokenId);
    }  
    
    function pause() public onlyOwner{
        _pause();
    }

    function unpause() public onlyOwner{
        _unpause();
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721 , ERC721Enumerable) returns(bool){
        return super.supportsInterface(interfaceId);
    }
}