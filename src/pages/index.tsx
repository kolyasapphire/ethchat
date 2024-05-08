import { useState, useEffect } from 'react'
import useLocalStorage from 'hooks/useLocalStorage'
import {
  Box,
  Link,
  VStack,
  HStack,
  Textarea,
  Button,
  Text,
} from '@chakra-ui/react'
import Layout from 'components/Layout'

import { decodeData } from 'utils'

import { lastBlockFetcher, blockRangeFetcher } from 'fetchers'

type Message = {
  address: string
  blockNumber: number
  txHash: string
  message: string
}

const IndexerLink = ({
  href,
  text,
}: {
  href: string
  text: string | number
}) => (
  <Link
    href={`https://etherscan.io/${href}`}
    isExternal
    textDecoration='underline'
    textUnderlineOffset={2}
    ml={1}
  >
    {text.toString().slice(0, 7)}
  </Link>
)

const Index = () => {
  const envRPC = process.env.NEXT_PUBLIC_RPC
  const [storageRPC, setStorageRPC] = useLocalStorage<string>('RPC', null)
  const RPC = envRPC ?? storageRPC
  const [rpcArea, setRpcArea] = useState<string>('')

  const [pointer, setPointer] = useState<number>(null)
  const [messages, setMessages] = useState<Message[]>([])

  const { data: lastBlock } = lastBlockFetcher(RPC)
  const { data: rawBlock, trigger: fetchBlock } = blockRangeFetcher(RPC)

  useEffect(() => {
    if (lastBlock) setPointer(lastBlock)
  }, [lastBlock])

  useEffect(() => {
    if (pointer) fetchBlock(pointer)
  }, [pointer, fetchBlock])

  // biome-ignore lint: We only care about rawBlock changing for deps, not messages (would be an inf loop)
  useEffect(() => {
    if (rawBlock) {
      const newMessages: Message[] = []

      for (const tx of rawBlock.prefetchedTransactions) {
        const decoded = decodeData(tx.data)
        if (decoded) {
          newMessages.push({
            address: tx.from,
            blockNumber: rawBlock.number,
            txHash: tx.hash,
            message: decoded,
          })
        }
      }

      setMessages([...newMessages, ...messages])
      setPointer(rawBlock.number - 1)
    }
  }, [rawBlock])

  const fromHowManyBlocks = messages.reduce(
    (acc, { blockNumber }) => acc.add(blockNumber),
    new Set(),
  ).size

  return (
    <Layout>
      <VStack>
        {!RPC ? (
          <VStack>
            <Text>Set your RPC endpoint here:</Text>
            <Textarea
              value={rpcArea}
              onChange={(e) => {
                setRpcArea(e.target.value)
              }}
            />
            <Button
              onClick={() => {
                setStorageRPC(rpcArea)
              }}
            >
              Save
            </Button>
          </VStack>
        ) : (
          <>
            <HStack>
              <Box>Latest block: {lastBlock ?? '...'}</Box>
              <Box>Handling block: {pointer ?? '...'}</Box>
            </HStack>
            <Text>
              {messages.length} messages from {fromHowManyBlocks} blocks
            </Text>
            <VStack>
              {!messages.length && <Box>Nothing yet, hang on.</Box>}
              {messages.map((x) => (
                <VStack
                  key={x.txHash}
                  border='1px solid grey'
                  borderRadius={5}
                  p={2}
                >
                  <HStack>
                    <Box>
                      Address:
                      <IndexerLink
                        href={`address/${x.address}`}
                        text={x.address}
                      />
                    </Box>
                    <Box>
                      Block:
                      <IndexerLink
                        href={`block/${x.blockNumber}`}
                        text={x.blockNumber}
                      />
                    </Box>
                    <Box>
                      Transaction:
                      <IndexerLink href={`tx/${x.txHash}`} text={x.txHash} />
                    </Box>
                  </HStack>
                  <Box textAlign='center'>{x.message}</Box>
                </VStack>
              ))}
            </VStack>
          </>
        )}
      </VStack>
    </Layout>
  )
}

export default Index
