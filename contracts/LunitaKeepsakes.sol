// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/// @title LUNITA Keepsakes
/// @notice Optional, transferable cosmetic collectibles for the LUNITA realm.
/// @dev This is an open cosmetic claim: the contract cannot verify in-game progress.
/// The game UI gates the claim button; keepsakes carry no financial value.
/// There is no owner, administrator, fee, or payable entry point.
contract LunitaKeepsakes is ERC721 {
    error InvalidKeepsake();
    error AlreadyClaimed();

    event KeepsakeClaimed(address indexed player, uint8 indexed keepsakeId, uint256 indexed tokenId);

    // One bit per keepsake, independent of current token ownership.
    mapping(address => uint16) private _claims;
    mapping(uint256 => uint8) private _keepsakes;
    uint256 private _totalMinted;

    constructor() ERC721("LUNITA Keepsakes", "LUNA") {}

    /// @notice Claim a cosmetic keepsake once per address and keepsake ID.
    /// @dev Transfers never reset claim history. Contract callers must accept ERC-721 tokens.
    function claim(uint8 keepsakeId) public returns (uint256 tokenId) {
        if (keepsakeId >= 12) revert InvalidKeepsake();
        uint16 bit = uint16(1) << keepsakeId;
        if ((_claims[msg.sender] & bit) != 0) revert AlreadyClaimed();

        // Commit all claim state before the ERC-721 receiver callback.
        _claims[msg.sender] |= bit;
        tokenId = ++_totalMinted;
        _keepsakes[tokenId] = keepsakeId;
        _safeMint(msg.sender, tokenId);

        emit KeepsakeClaimed(msg.sender, keepsakeId, tokenId);
    }

    function hasClaimed(address player, uint8 keepsakeId) public view returns (bool) {
        if (keepsakeId >= 12) revert InvalidKeepsake();
        return (_claims[player] & (uint16(1) << keepsakeId)) != 0;
    }

    function keepsakeOf(uint256 tokenId) public view returns (uint8) {
        _requireOwned(tokenId);
        return _keepsakes[tokenId];
    }

    function keepsakeName(uint8 keepsakeId) public pure returns (string memory) {
        if (keepsakeId >= 12) revert InvalidKeepsake();
        string[12] memory names = [
            "First Spark",
            "Brave Beginning",
            "Forest Lantern",
            "Forge Ember",
            "Tide Charm",
            "Garden Bloom",
            "Moon Opal",
            "Crystal Collector",
            "Long Tide Voyager",
            "First Bloom",
            "Gentle Return",
            "Realm Awakened"
        ];
        return names[keepsakeId];
    }

    function claimedBy(address player) public view returns (bool[12] memory claimed) {
        uint16 mask = _claims[player];
        for (uint8 i = 0; i < 12; ++i) {
            claimed[i] = (mask & (uint16(1) << i)) != 0;
        }
    }

    function totalMinted() public view returns (uint256) {
        return _totalMinted;
    }

    /// @notice Fully onchain JSON metadata and embedded SVG artwork.
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        uint8 keepsakeId = keepsakeOf(tokenId);
        string memory label = keepsakeName(keepsakeId);
        string memory image = string.concat(
            "data:image/svg+xml;base64,", Base64.encode(bytes(_svg(keepsakeId, label)))
        );
        return string.concat(
            "data:application/json;base64,",
            Base64.encode(
                bytes(
                    string.concat(
                        '{"name":"', label,
                        '","description":"A keepsake from the LUNITA realm. Small steps, magical worlds.",',
                        '"attributes":[{"trait_type":"Keepsake id","value":',
                        Strings.toString(uint256(keepsakeId)),
                        '}],"image":"', image, '"}'
                    )
                )
            )
        );
    }

    function _svg(uint8 keepsakeId, string memory label) private pure returns (string memory) {
        string[4] memory accents = ["#829878", "#a67683", "#7d97a5", "#b8893a"];
        return string.concat(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480">',
            '<rect width="480" height="480" fill="#f4ead5"/>',
            '<rect x="16" y="16" width="448" height="448" rx="12" fill="none" stroke="#6b1a2d" stroke-width="4"/>',
            '<rect x="30" y="30" width="420" height="420" rx="8" fill="none" stroke="',
            accents[keepsakeId % 4],
            '" stroke-width="2"/>',
            '<path d="M270 110 A85 85 0 1 0 310 250 A72 72 0 0 1 270 110Z" fill="#b8893a"/>',
            '<path d="M324 121 L332 142 L354 143 L337 157 L342 179 L324 166 L305 179 L311 157 L293 143 L316 142Z" fill="#b8893a"/>',
            '<circle cx="240" cy="325" r="6" fill="', accents[keepsakeId % 4], '"/>',
            '<text x="240" y="378" text-anchor="middle" font-family="Georgia,serif" font-size="26" fill="#6b1a2d">',
            label,
            '</text><text x="240" y="420" text-anchor="middle" font-family="Georgia,serif" font-size="14" letter-spacing="5" fill="#6b1a2d">LUNITA</text></svg>'
        );
    }
}
