import { useEffect, useState } from "react";
import { getLiquidityPools } from "../graphql/queries";
import useProvider from "./useProvider";

export default function useLiquidityPools(account) {
    const [pools, setPools] = useState([])
    const provider = useProvider()

    useEffect(() => {
        if (account) {
            getLiquidityPools(account)
                .then(pools => {
                    const result = pools.map(pool => {
                        const share = pool.liquidityTokenBalance / pool.pair.totalSupply
                        const liquidityTokenBalanceUSD = share * pool.pair.reserveUSD
                        return {
                            ...pool,
                            share,
                            liquidityTokenBalanceUSD
                        }
                    })
                    setPools(result)
                })
        }
    }, [account, provider])

    return pools
}
