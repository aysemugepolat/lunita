import { parseAbi } from 'viem'

/** Address of the deployed LunitaKeepsakes contract on Arc Testnet. Set VITE_KEEPSAKES_ADDRESS in .env. */
export const KEEPSAKES_ADDRESS = (import.meta.env.VITE_KEEPSAKES_ADDRESS as `0x${string}` | undefined) || undefined

export const KEEPSAKES_ABI = parseAbi([
  'function claim(uint8 keepsakeId) returns (uint256 tokenId)',
  'function claimedBy(address player) view returns (bool[12])',
  'function hasClaimed(address player, uint8 keepsakeId) view returns (bool)',
  'function totalMinted() view returns (uint256)',
  'event KeepsakeClaimed(address indexed player, uint8 indexed keepsakeId, uint256 indexed tokenId)',
])
