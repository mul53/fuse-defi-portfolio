import { useMemo } from 'react'
import { ethers } from 'ethers'

export default function useProvider() {
    return useMemo(() => 
        new ethers.providers.JsonRpcProvider('https://rpc.fuse.io'), []
    )
}
