import { useEffect, useState } from 'react'
import Pool from '../../components/pool'
import useLiquidityPools from '../../hooks/useLiquidityPools'
import useNativeBalance from '../../hooks/useNativeBalance'
import useTokenBalances from '../../hooks/useTokenBalances'

function AccountOverview({ account }) {
  const nativeBalance = useNativeBalance(account)
  const tokenBalances = useTokenBalances(account)
  const pools = useLiquidityPools(account)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const tokenBalancesTotal =
      nativeBalance.balanceUSD +
      tokenBalances.reduce((prev, next) => prev + next.balanceUSD, 0) +
      pools.reduce((prev, next) => prev + next.liquidityTokenBalanceUSD, 0)
    setTotal(tokenBalancesTotal)
  }, [nativeBalance.balanceUSD, pools, tokenBalances])

  return (
    <div>
      <h2>AccountOverview: {account}</h2>
      <h2>Porfolio Value: ${total}</h2>
      <div>
        <h3>Assets</h3>
        <ul>
          <li>
            <div>Fuse</div>
            <div>{nativeBalance.balance}</div>
            <div>${nativeBalance.balanceUSD}</div>
          </li>
          {tokenBalances.map((tokenBalance) => (
            <li>
              <div>{tokenBalance.token.symbol}</div>
              <div>{tokenBalance.balance}</div>
              <div>${tokenBalance.balanceUSD}</div>
            </li>
          ))}
        </ul>
        <h3>Liquidity Pools</h3>
        <ul>
          {pools.map((pool) => (
            <Pool pool={pool} />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AccountOverview
