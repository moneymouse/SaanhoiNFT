// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SBT is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(address => bool) private whitelist;

    string private _baseUri;

    constructor(string memory baseUri) ERC721("ContriNFT", "CSBT") {
        _baseUri = baseUri;
    }

    function safeMint() public {
        address to = _msgSender();
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        require(whitelist[to] || balanceOf(to) < 1, "Multi Mint: Tester Only");
        _safeMint(to, tokenId);
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overriden in child contracts.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseUri;
    }

    function changeUri(string memory baseUri) public onlyOwner {
        _baseUri = baseUri;
    }

    function addWhiteList(address to) onlyOwner public {
        whitelist[to] = true;
    }

    function SBTOf(address owner) view public returns (uint256) {
        for (uint256 i = _tokenIdCounter.current(); i > 0; i--) {
            if (owner == ownerOf(i)) {
                return i;
            }
        }
        return 0;
    }

    // Ban transfer
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        require(false, "SBT: SBT Can't Be Transferred");
    }
}