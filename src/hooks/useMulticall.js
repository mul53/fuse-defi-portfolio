import { Interface } from "@ethersproject/abi";
import { useEffect, useMemo, useState } from "react";
import { MULTICALL_ADDRESS } from "../constants";
import MULTICALL_ABI from "../constants/abis/multicall.json";
import useContract from "./useContract";

export function useMultipleContractMultiCall(addresses, abi, methodName, data) {
    const [result, setResult] = useState(null)
    const contract = useContract(MULTICALL_ADDRESS, MULTICALL_ABI)
    const contractInterface = useMemo(() => new Interface(abi), [abi]) 
    const fragment = useMemo(() => contractInterface.getFunction(methodName), [contractInterface, methodName])
    const callData = useMemo(() => fragment && data[0].length ? contractInterface.encodeFunctionData(fragment, data) : undefined, [contractInterface, data, fragment])
    const calls = useMemo(() => fragment && addresses && addresses.length > 0 && callData 
        ? addresses.map(address => {
            return  address && callData 
                ? [
                    address,
                    callData
                ]
                : undefined
        })
        : [],
    [addresses, callData, fragment])

    useEffect(() => {
        contract.aggregate(calls)
            .then(data => {
                const [, results] = data
                const parsedResults = results.map(result => {
                    if (result !== '0x') {
                        return contractInterface.decodeFunctionResult(fragment, result)
                    }
                    return undefined
                })
                setResult(parsedResults)
            })
    }, [calls])

    return result
}
