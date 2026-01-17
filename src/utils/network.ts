import { SEPOLIA_CHAIN_ID } from '../constants'

function formatChainId(chainId: number): string {
  return `eip155:${chainId}`
}

export function isSepoliaNetwork(chain: string | undefined): boolean {
  if (!chain) {
    return false
  }
  const chainStr = String(chain)
  const sepoliaChainId = formatChainId(SEPOLIA_CHAIN_ID)
  
  return (
    chainStr === sepoliaChainId ||
    chainStr === String(SEPOLIA_CHAIN_ID) ||
    chainStr === `0x${SEPOLIA_CHAIN_ID.toString(16)}`
  )
}
