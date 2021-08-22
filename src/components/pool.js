export default function Pool({ pool }) {
  return (
    <li>
      <div>
        Fuseswap {pool.pair.token0.symbol}/{pool.pair.token1.symbol} Pool{' '}
        {pool.share * 100}%
      </div>
      <div>{pool.liquidityTokenBalance} UNI-V2</div>
      <div>${pool.liquidityTokenBalanceUSD}</div>
    </li>
  )
}
