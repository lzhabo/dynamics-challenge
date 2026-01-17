import { useState, useEffect } from 'react'
import { useDynamicContext, useTokenBalances } from '@dynamic-labs/sdk-react-core'
import { SEPOLIA_CHAIN_ID, USDC_SEPOLIA_ADDRESS } from '../constants'
import { parseBalance, formatBalance } from '../utils/formatters'

interface UseBalanceReturn {
  ethBalance: string | null
  usdcBalance: string | null
  isLoading: boolean
  error: string | null
}

export function useBalance(): UseBalanceReturn {
  const { primaryWallet, user } = useDynamicContext()
  const isAuthenticated = !!user
  const [ethBalance, setEthBalance] = useState<string | null>(null)
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { tokenBalances, isLoading: balancesLoading } = useTokenBalances({
    accountAddress: primaryWallet?.address || '',
    networkId: primaryWallet?.address ? SEPOLIA_CHAIN_ID : undefined,
  })

  useEffect(() => {
    const fetchBalances = async () => {
      if (!isAuthenticated || !primaryWallet?.address) {
        setEthBalance(null)
        setUsdcBalance(null)
        setError(null)
        return
      }

      try {
        setError(null)

        try {
          const balance: unknown = await primaryWallet.getBalance()
          const parsedBalance = parseBalance(balance)
          setEthBalance(formatBalance(parsedBalance, 4))
        } catch (err) {
          console.error('Error fetching ETH balance:', err)
          const ethToken = tokenBalances?.find(
            (token) =>
              token.symbol === 'ETH' ||
              token.symbol === 'SepoliaETH' ||
              token.symbol === 'SEP'
          )
          if (ethToken) {
            const parsedBalance = parseBalance(ethToken.balance)
            setEthBalance(formatBalance(parsedBalance, 4))
          } else {
            setEthBalance('0.0000')
          }
        }

        const usdcToken = tokenBalances?.find(
          (token) =>
            token.address?.toLowerCase() === USDC_SEPOLIA_ADDRESS.toLowerCase()
        )
        if (usdcToken) {
          const parsedBalance = parseBalance(usdcToken.balance)
          setUsdcBalance(formatBalance(parsedBalance, 2))
        } else {
          setUsdcBalance('0.00')
        }
      } catch (err: unknown) {
        console.error('Error fetching balances:', err)
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch balances'
        setError(errorMessage)
      }
    }

    fetchBalances()
  }, [primaryWallet, isAuthenticated, tokenBalances])

  return {
    ethBalance,
    usdcBalance,
    isLoading: balancesLoading,
    error,
  }
}
