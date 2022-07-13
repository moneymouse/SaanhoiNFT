// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract SCPV is ERC1155, Ownable, Pausable {
    string public name = "Saanhoi Club Promotion Voucher";

    constructor(string memory URI) ERC1155(URI) {
        _mint(msg.sender, 1, 20 * 10000, "");
    }

    function setURI(string memory newUrl) public onlyOwner {
        _setURI(newUrl);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
    public
    onlyOwner
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
    public
    onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
    internal
    whenNotPaused
    override
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function teamBatchTransfer(address[] memory tos, uint256 id)
    public
    onlyOwner
    {
        for (uint256 i = 0; i < tos.length; i++) {
            address to = tos[i];
            safeTransferFrom(msg.sender, to, id, 1, "Transfer From Team.");
        }
    }
}