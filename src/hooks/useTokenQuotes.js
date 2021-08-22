import axios from 'axios'
import { useState, useEffect, useMemo } from 'react'

export default function useTokenQuotes(tokens) {
  const [quotes, setQuotes] = useState(null)
  const addresses = useMemo(() => tokens.map((token) => token.foreignAddress), [
    tokens,
  ])

  useEffect(() => {
    if (addresses.length) {
      axios
        .get(
          `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${addresses.join(
            ',',
          )}&vs_currencies=usd`,
        )
        .then((response) => {
          const data = tokens
            .map((token) => ({
              address: token.address,
              usd: response.data[token.foreignAddress] ? response.data[token.foreignAddress].usd : 0,
            }))
            .reduce((prev, next) => {
                prev[next.address] = next.usd
                return prev
            }, {})

          setQuotes(data)
        })
    }
  }, [addresses, tokens])

  return quotes
}
