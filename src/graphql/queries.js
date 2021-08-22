import gql from "graphql-tag"
import { fuseswapClient } from "./client"

export async function getTokenPrices(tokens) {
    const query = gql(`
        query {
            tokens(where: {
                id_in: [${tokens.map(v => `"${v.toLowerCase()}"`).join(',')}]
            }) {
                id
                name
                symbol
                decimals
                derivedETH
            }
            bundle(id: "1") {
                ethPrice
            }
        }
    `)
    

    const result = await fuseswapClient.query({ query })

    return {
        tokens: result?.data?.tokens,
        bundle: result?.data?.bundle
    }
}

export async function getLiquidityPools(account) {
    const query = gql(`
        query {
            liquidityPositions(where: { 
                user: "${account.toLowerCase()}",
                liquidityTokenBalance_gt: "0"
            }) {
                liquidityTokenBalance
                pair {
                    id
                    reserve0
                    reserve1
                    token0 {
                        id
                        decimals
                        name
                        symbol
                    }
                    token1 {
                        id
                        decimals
                        name
                        symbol
                    }
                    totalSupply
                    reserveUSD
                }
            }
        }
    `)

    const result = await fuseswapClient.query({ query })
    return result?.data?.liquidityPositions
}
