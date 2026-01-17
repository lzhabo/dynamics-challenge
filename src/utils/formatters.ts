export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

export function formatWalletAddress(address: string, startLength = 6, endLength = 4): string {
  if (address.length <= startLength + endLength) {
    return address
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

export function formatTransactionHash(txHash: string, startLength = 8, endLength = 6): string {
  if (txHash.length <= startLength + endLength) {
    return txHash
  }
  return `${txHash.slice(0, startLength)}...${txHash.slice(-endLength)}`
}

export function formatBalance(balance: number | string, decimals: number = 2): string {
  const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance
  if (isNaN(numBalance)) {
    return '0.00'
  }
  return numBalance.toFixed(decimals)
}

export function parseBalance(balance: unknown): number {
  if (typeof balance === 'string') {
    return parseFloat(balance) || 0
  }
  if (typeof balance === 'number') {
    return balance
  }
  if (typeof balance === 'bigint') {
    const weiValue = String(balance)
    return parseFloat(weiValue) / 1e18
  }
  if (typeof balance === 'object' && balance !== null) {
    const balanceObj = balance as Record<string, unknown>
    const formatted = balanceObj.formatted as string | undefined
    const value = balanceObj.value as string | number | bigint | undefined
    
    if (formatted) {
      return parseFloat(formatted)
    }
    if (value) {
      return parseBalance(value)
    }
  }
  return 0
}
