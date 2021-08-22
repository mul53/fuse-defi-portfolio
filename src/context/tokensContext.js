import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useMemo } from 'react/cjs/react.development'
import { getTokenPrices } from '../graphql/queries'

const Context = createContext({})

async function getTokens() {
  const response = await axios.get('https://service.fuseswap.com/api/v1/tokens')
  return response.data.data.tokens.filter((token) => token.type === 'bridged')
}

async function getCoingeckoQuotes(tokens) {
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokens
      .map((token) => token.foreignAddress)
      .join(',')}&vs_currencies=usd`,
  )

  return tokens
    .map((token) => ({
      address: token.address,
      usd: response.data[token.foreignAddress]
        ? response.data[token.foreignAddress].usd
        : 0,
    }))
    .reduce((prev, next) => {
      prev[next.address] = next.usd
      return prev
    }, {})
}

async function getFuseswapQuotes() {
  const response = await getTokenPrices([
    '0x0be9e53fd7edac9f859882afdda116645287c629',
    '0x249be57637d8b013ad64785404b24aebae9b098b',
  ])

  return response.tokens
    .map((token) => ({
      address: token.id,
      usd: token.derivedETH * response.bundle.ethPrice,
    }))
    .reduce((prev, next) => {
      prev[next.address] = next.usd
      return prev
    }, {})
}

async function getQuotes(tokens) {
  const coingecko = await getCoingeckoQuotes(tokens)
  const fuseswap = await getFuseswapQuotes()
  return {
    ...coingecko,
    ...fuseswap,
  }
}

export function TokensProvider({ children }) {
  const [tokens, setTokens] = useState([])
  const [quotes, setQuotes] = useState(null)

  useEffect(() => {
    getTokens().then(setTokens)
  }, [])

  useEffect(() => {
    if (tokens.length) {
      getQuotes(tokens).then(setQuotes)
    }
  }, [tokens])

  const value = useMemo(() => ({ tokens, quotes }), [quotes, tokens])

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useTokensContext() {
  const context = useContext(Context)
  return context
}
