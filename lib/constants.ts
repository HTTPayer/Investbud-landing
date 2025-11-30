// Base Sepolia Configuration
export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const BASE_SEPOLIA_RPC = 'https://sepolia.base.org';

// USDC Contract on Base Sepolia
export const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

// USDC ABI (only the functions we need)
export const USDC_ABI = [
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function allowance(address owner, address spender) public view returns (uint256)',
  'function balanceOf(address account) public view returns (uint256)',
  'function transfer(address to, uint256 amount) public returns (bool)',
  'function decimals() public view returns (uint8)',
] as const;

// Backend URLs
export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const BACKEND_URL = '/api/chat'; // Use local API proxy to avoid CORS issues

