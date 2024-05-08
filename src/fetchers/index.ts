import useQuery from 'swr'
import useMutation from 'swr/mutation'
import { ethers } from 'ethers'

const CHAIN_ID = 1

const PROVIDER_CONFIG = {
  staticNetwork: true,
}

const lastBlockRequest = async ([_key, RPC]: string) => {
  const block = await new ethers.JsonRpcProvider(
    RPC,
    CHAIN_ID,
    PROVIDER_CONFIG,
  ).getBlock('latest')
  return block.number
}

export const lastBlockFetcher = (RPC: string, paused: boolean) =>
  useQuery(['lastBlock', RPC], lastBlockRequest, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    isPaused: () => paused,
  })

const blockRequest = async (
  [_key, RPC]: [string, string],
  args: { arg: number },
) => {
  const blockNumber = args.arg

  const block = await new ethers.JsonRpcProvider(
    RPC,
    CHAIN_ID,
    PROVIDER_CONFIG,
  ).getBlock(blockNumber, true) // prefetch transactions in block

  return block as ethers.Block & {
    prefetchedTransactions: ethers.TransactionResponse[] // hack bad ethers types
  }
}

export const blockRangeFetcher = (RPC: string) =>
  useMutation(['blockRangeRequest', RPC], blockRequest)
