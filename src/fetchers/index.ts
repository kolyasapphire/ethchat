import useQuery from 'swr'
import useMutation from 'swr/mutation'
import { ethers } from 'ethers'

const CHAIN_ID = 1

const lastBlockRequest = async (RPC: string) =>
  (await new ethers.JsonRpcProvider(RPC, CHAIN_ID).getBlock('latest')).number

  useQuery('lastBlock', () => lastBlockRequest(RPC), {
export const lastBlockFetcher = (RPC: string, paused: boolean) =>
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

  const block = await new ethers.JsonRpcProvider(RPC, CHAIN_ID).getBlock(
    blockNumber,
    true,
  ) // prefetch transactions in block

  return block as ethers.Block & {
    prefetchedTransactions: ethers.TransactionResponse[] // hack bad ethers types
  }
}

export const blockRangeFetcher = (RPC: string) =>
  useMutation(['blockRangeRequest', RPC], blockRequest)
