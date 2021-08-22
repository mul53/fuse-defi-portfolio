import { ethers } from "ethers"
import useProvider from "./useProvider"

export default function useContract(address, abi) {
    const provider = useProvider()
    return new ethers.Contract(address, abi, provider)
}
