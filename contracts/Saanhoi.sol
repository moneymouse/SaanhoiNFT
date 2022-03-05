// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Saanhoi is ERC721,ERC721Enumerable,Pausable,Ownable{

    enum STATUS {PENDING,WHITELIST,PUBLIC_SALE}
    STATUS public STAGE;

    mapping (address =>bool ) private WHITELIST;/** default:false */

    uint256 immutable public PRICE;
    uint256 immutable private _maxTotalSupply;

    string private _uri;

    Counters.Counter private _tokenIdCounter;

    /** verify the STAGE */
    modifier onlyStage(STATUS stage_){
        require(stage_ == STAGE, "Saanhoi: It's not "+stage_+" stage.");
        _;
    }

    constructor(string memory baseURI_) ERC721("Saanhoi","SA"){
        PRICE = 0.08 ether;
        _maxTotalSupply = 10000;
        _uri = baseURI_;
        STAGE = STATUS.PENDING;
    }

    function maxTotalSupply() public view returns(uint256){
        return _maxTotalSupply;
    }

    // TODO: test payable, onlyStage
    function mint(uint256 num) public onlyStage(STATUS.PUBLIC_SALE) nonReentrant payable{
        require(msg.value == num*PRICE, "Saanhoi: Lack of ETH");
        safeMultiplyMint(msg.sender,num);
    }

    // TODO: whiteListMint(nonReentrant)
    function whiteListMint(uint256 num) public onlyStage(STATUS.WHITELIST) nonReentrant payable{
        require(msg.value == num*PRICE, "Saanhoi: Lack of ETH");
        require(isWhiteListMember(msg.sender), "Saanhoi: Lack of permission");
        safeMultiplyMint(msg.sender,num);
    }

    // TODO:test all require
    function safeMultiplyMint(address to,uint256 num) private{
        require(num != 0, "Saanhoi: Can't mint zero NFT");

        for(uint256 i = 0;i < num;i++){
            _tokenIdCounter.increment();
            require(_tokenIdCounter<=maxTotalSupply, "Saanhoi: All NFTs have already been minted.");
            _safeMint(to,_tokenIdCounter.current());
        }
    }

    /**
    *   White list manage
    *   TODO: test all
    */

    function isWhiteListMember(address sender) private view returns(bool){
        return WHITELIST[sender];
    }

    function addWhiteListMember(address[] members) public onlyOwner{
        for(uint256 i=0;i < members.length; i++){
            // only member is not in WHITELIST, add to WHITELIST;
            if( !isWhiteListMember(members[i]) ) WHITELIST[members] = true;
        }
    }

    /** Manage STAGE
    *   TODO: test
    */

    function setStage(STATUS stage_) public onlyOwner{
        STAGE = stage_;
    }

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