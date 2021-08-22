import { formatEther } from '@ethersproject/units'
import { useEffect, useState } from 'react'
import { useTokensContext } from '../context/tokensContext'
import useProvider from './useProvider'

export default function useNativeBalance(account) {
  const [balance, setBalance] = useState('0')
  const provider = useProvider()
  const { quotes } = useTokensContext()

  useEffect(() => {
    if (account) {
      provider.getBalance(account).then((data) => setBalance(data.toString()))
    }
  }, [account, provider])

  return {
    balance: formatEther(balance),
    balanceUSD:
      quotes && quotes['0x0be9e53fd7edac9f859882afdda116645287c629']
        ? quotes['0x0be9e53fd7edac9f859882afdda116645287c629'] *
          formatEther(balance)
        : 0,
  }
}
