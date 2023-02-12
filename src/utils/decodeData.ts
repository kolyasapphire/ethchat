import { ethers } from 'ethers'

const englishFilter = /^[a-zA-Z0-9?><;,{}[\]\-_+=!@#$%\^&*|']*$/

const blacklist = [
  'Ignore',
  'BFX_REFILL_SWEEP',
  'FA%}',
  'cs',
  'RM',
  'Rns_',
  'W8b%',
]

export const decodeData = (data: string) => {
  try {
    const decoded = ethers.toUtf8String(data)
    if (decoded.match(englishFilter) && !blacklist.includes(decoded)) {
      return decoded
    } else {
      return null
    }
  } catch {
    return null
  }
}
