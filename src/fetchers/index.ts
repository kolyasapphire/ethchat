import useQuery from 'swr'
import useMutation from 'swr/mutation'
import { ethers } from 'ethers'

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC, 1)

const lastBlockRequest = async () => (await provider.getBlock('latest')).number

export const lastBlockFetcher = () =>
  useQuery('lastBlock', lastBlockRequest, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  })

const blockRequest = async (_key: string, args: { arg: number }) => {
  const blockNumber = args.arg

  const block = await provider.getBlock(blockNumber, true) // prefetch transactions in block

  return block as ethers.Block & {
    prefetchedTransactions: ethers.TransactionResponse[] // hack bad ethers types
  }
}

export const blockRangeFetcher = () =>
  useMutation('blockRangeRequest', blockRequest)
