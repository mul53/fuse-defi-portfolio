import { useEffect, useState, useMemo, useCallback } from 'react'
import { useMultipleContractMultiCall } from './useMulticall'
import ERC20_ABI from '../constants/abis/erc20.json'
import axios from 'axios'
import useTokenQuotes from './useTokenQuotes'
import { formatUnits } from '@ethersproject/units'
import { useTokensContext } from '../context/tokensContext'

export function useTokens() {
  const [tokens, setTokens] = useState([])

  useEffect(() => {
    axios
      .get('https://service.fuseswap.com/api/v1/tokens')
      .then(response => {
        if (response.status === 200) {
          const bridgedTokens = response.data.data.tokens.filter(
            (token) => token.type === 'bridged' || token.type === 'misc',
          )
          setTokens(bridgedTokens)
        }
      })
  }, [])

  return tokens
}

export default function useTokenBalances(account) {
  const tokens = useTokens()
  const tokenAddresses = useMemo(() => tokens.map(token => token.address), [tokens]) 
  const { quotes: tokenQuotes } = useTokensContext()

  const results = useMultipleContractMultiCall(
    tokenAddresses,
    ERC20_ABI,
    'balanceOf',
    [account],
  )

  const tokenBalances = useMemo(() => {
      if (results && results.length && tokens.length && tokenQuotes) {
        return tokenAddresses.map((tokenAddress, idx) => {
            const token = tokens.find(v => v.address.toLowerCase() === tokenAddress.toLowerCase())
            const balanceWei = results[idx][0]
            const balanceFormatted = formatUnits(balanceWei, token.decimals)
            const balanceUSD = tokenQuotes[tokenAddress.toLowerCase()] * balanceFormatted
            return { 
                token, 
                balance: balanceFormatted,
                balanceUSD: balanceUSD
            }
        }).filter(tokenBalance => tokenBalance.balance > 0)
      }

      return []
  }, [results, tokenAddresses, tokenQuotes, tokens])

  return tokenBalances
}
