// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Saanhoi is ERC721,ERC721Enumerable,Pausable,Ownable,ReentrancyGuard{

    enum STATUS {PENDING,WHITELIST,PUBLIC_SALE}
    STATUS public STAGE;

    mapping (address => uint ) private WHITELIST;/** default:false */

    uint256 immutable public PRICE;
    uint256 immutable private _maxTotalSupply;

    string private _uri;

    uint immutable private _WHITELIST_MAX_MINT_TIMES;
    uint immutable private _MINT_BATCH;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    /** verify the STAGE */
    modifier onlyStage(STATUS stage_){
        require(stage_ == STAGE, "Saanhoi: It's not right stage.");
        _;
    }

    constructor(string memory baseURI_) ERC721("Saanhoi","SA"){
        PRICE = 0.08 ether;
        _maxTotalSupply = 10000;
        _uri = baseURI_;
        STAGE = STATUS.PENDING;

        _WHITELIST_MAX_MINT_TIMES = 2;
        _MINT_BATCH = 5;
    }

    function maxTotalSupply() public view returns(uint256){
        return _maxTotalSupply;
    }

    function mint(uint256 num) public onlyStage(STATUS.PUBLIC_SALE) nonReentrant payable{
        require(num <= _MINT_BATCH,"Saanhoi: over batch");
        require(msg.value == num*PRICE, "Saanhoi: Lack of ETH");
        safeMultiplyMint(msg.sender,num);
    }

    function whiteListMint(uint256 num) public onlyStage(STATUS.WHITELIST) nonReentrant payable{
        require(msg.value == num*PRICE, "Saanhoi: Lack of ETH");
        require(isWhiteListMember(msg.sender), "Saanhoi: Illegal members");
        require(restWhiteListTimesOf(msg.sender) >= num, "Saanhoi: Lack of times");
        safeMultiplyMint(msg.sender, num);
        decreaseWhiteListTimesOf(msg.sender, num);
    }

    // TODO:test all require
    function safeMultiplyMint(address to,uint256 num) private{
        require(num > 0, "Saanhoi: Can't mint zero NFT");

        for(uint256 i = 0;i < num;i++){
            _tokenIdCounter.increment();
            uint256 current_ = _tokenIdCounter.current();
            require(current_ <= maxTotalSupply(), "Saanhoi: All NFTs have already been minted.");
            _safeMint(to,current_);
        }
    }

    /**
    *   White list manage
    */

    function isWhiteListMember(address sender) private view returns(bool){
        return WHITELIST[sender] > 0;
    }

    function addWhiteListMember(address[] calldata members) public onlyOwner{
        for(uint256 i=0;i < members.length; i++){
            // only member is not in WHITELIST, add to WHITELIST;
            if( !isWhiteListMember(members[i]) ) WHITELIST[members[i]] = 1 + _WHITELIST_MAX_MINT_TIMES;
        }
    }

    function decreaseWhiteListTimesOf(address member,uint num) private{
        WHITELIST[member] = WHITELIST[member] - num;
    }

    function restWhiteListTimesOf(address member) private view returns (uint){
        return WHITELIST[member] - 1;
    }

    /** Manage STAGE
    */

    function setStage(STATUS stage_) private{
        require(STAGE != stage_,"Saanhoi: Have been stage_");
        STAGE = stage_;
    }

    function toWHITELISTStage() public onlyOwner{
        setStage(STATUS.WHITELIST);
    }

    function toPUBLICStage() public onlyOwner{
        setStage(STATUS.PUBLIC_SALE);
    }

    /**
     *  manage URI
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

    function release() public onlyOwner{
        uint256 balance_ = address(this).balance;
        payable(address(owner())).transfer(balance_);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721 , ERC721Enumerable) returns(bool){
        return super.supportsInterface(interfaceId);
    }
}