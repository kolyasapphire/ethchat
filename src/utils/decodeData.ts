import { ethers } from 'ethers'

const blacklist = [
  'Ignore',
  'BFX_REFILL_SWEEP',
  'FA%}',
  'cs',
  'RM',
  'Rns_',
  'W8b%',
  '$AGI',
  'c',
]

export const decodeData = (data: string) => {
  try {
    const decoded = ethers.toUtf8String(data)
    if (decoded.length > 5 && !blacklist.includes(decoded)) {
      return decoded
    } else {
      return null
    }
  } catch {
    return null
  }
}
