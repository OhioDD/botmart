import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js'
import { MERCHANT_WALLET_ADDRESS, SOLANA_NETWORK } from '../config/wallet'

const connection = new Connection(SOLANA_NETWORK, 'confirmed')

export const MERCHANT_WALLET = MERCHANT_WALLET_ADDRESS

export const connectWallet = async () => {
  try {
    const { solana } = window

    if (!solana) {
      alert('Phantom wallet not found! Please install it from phantom.app')
      return null
    }

    if (!solana.isPhantom) {
      alert('Please use Phantom wallet')
      return null
    }

    const response = await solana.connect()
    return response.publicKey.toString()
  } catch (error) {
    return null
  }
}

export const disconnectWallet = async () => {
  try {
    const { solana } = window
    if (solana) {
      await solana.disconnect()
    }
  } catch (error) {
  }
}

export const getWalletBalance = async (walletAddress) => {
  try {
    const publicKey = new PublicKey(walletAddress)
    const balance = await connection.getBalance(publicKey)
    return balance / LAMPORTS_PER_SOL
  } catch (error) {
    return 0
  }
}

export const checkPayment = async (merchantWallet, expectedAmount, timeWindow = 300) => {
  try {
    const publicKey = new PublicKey(merchantWallet)
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 })
    
    const now = Date.now() / 1000
    const cutoffTime = now - timeWindow

    for (const sig of signatures) {
      if (sig.blockTime < cutoffTime) continue

      const tx = await connection.getTransaction(sig.signature, {
        maxSupportedTransactionVersion: 0
      })

      if (!tx || !tx.meta || tx.meta.err) continue

      const accountIndex = tx.transaction.message.accountKeys.findIndex(
        key => key.toBase58() === merchantWallet
      )

      if (accountIndex === -1) continue

      const preBalance = tx.meta.preBalances[accountIndex]
      const postBalance = tx.meta.postBalances[accountIndex]
      const amountReceived = (postBalance - preBalance) / LAMPORTS_PER_SOL

      const tolerance = 0.01
      if (amountReceived > 0 && Math.abs(amountReceived - expectedAmount) < tolerance) {
        return {
          success: true,
          signature: sig.signature,
          amount: amountReceived,
          timestamp: sig.blockTime
        }
      }
    }

    return { success: false, message: 'Payment not found' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

export const monitorPayment = async (merchantWallet, expectedAmount, onPaymentReceived, timeout = 600) => {
  const startTime = Date.now()
  const maxTime = timeout * 1000

  const checkInterval = setInterval(async () => {
    if (Date.now() - startTime > maxTime) {
      clearInterval(checkInterval)
      onPaymentReceived({ success: false, message: 'Payment timeout' })
      return
    }

    const result = await checkPayment(merchantWallet, expectedAmount, 600)
    if (result.success) {
      clearInterval(checkInterval)
      onPaymentReceived(result)
    }
  }, 5000)

  return checkInterval
}

export const generatePaymentQR = (merchantWallet, amount, label = 'Discord Bot Payment') => {
  return `solana:${merchantWallet}?amount=${amount}&label=${encodeURIComponent(label)}`
}

export const sendPayment = async (recipientAddress, amount) => {
  try {
    const { solana } = window

    if (!solana || !solana.isConnected) {
      return { success: false, message: 'Wallet not connected' }
    }

    const fromPubkey = solana.publicKey
    const toPubkey = new PublicKey(recipientAddress)
    
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: fromPubkey
    }).add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: Math.floor(amount * LAMPORTS_PER_SOL)
      })
    )

    const signed = await solana.signTransaction(transaction)
    const signature = await connection.sendRawTransaction(signed.serialize())

    await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight })

    return {
      success: true,
      signature: signature
    }
  } catch (error) {
    return { success: false, message: error.message || 'Payment failed' }
  }
}

export const isPhantomInstalled = () => {
  return window.solana && window.solana.isPhantom
}
