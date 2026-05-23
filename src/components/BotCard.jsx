import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { ArrowRight, Check, ClipboardCopy, Clock3, Copy, RotateCw, ScanLine, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { MERCHANT_WALLET, monitorPayment } from '../utils/solana'
import { createOrder, updateOrderStatus } from '../utils/orders'
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from '../utils/email'

const BotCard = ({ bot, index }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [copied, setCopied] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('waiting')
  const [customerInfo, setCustomerInfo] = useState({
    discord: '',
    email: '',
  })
  const paymentIntervalRef = useRef(null)

  useEffect(() => {
    return () => {
      if (paymentIntervalRef.current) {
        clearInterval(paymentIntervalRef.current)
      }
    }
  }, [])

  const paymentAddress = MERCHANT_WALLET
  const priceInSOL = parseFloat(bot.price.replace(' SOL', ''))
  const features = bot.highlights || [
    'Complete source code',
    'Configuration files',
    'Setup documentation',
    'Lifetime support',
    'Self-hosted deployment',
    'One-time payment',
  ]

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(paymentAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBuyNow = () => {
    setShowCustomerForm(true)
    setPaymentStatus('waiting')
  }

  const closeModal = () => {
    if (paymentIntervalRef.current) {
      clearInterval(paymentIntervalRef.current)
      paymentIntervalRef.current = null
    }
    setShowDetails(false)
    setShowPayment(false)
    setShowCustomerForm(false)
  }

  const handleCustomerSubmit = async (event) => {
    event.preventDefault()
    setShowCustomerForm(false)
    startManualPayment()
  }

  const startManualPayment = () => {
    setShowPayment(true)
    setPaymentStatus('checking')

    const intervalId = monitorPayment(
      paymentAddress,
      priceInSOL,
      async (result) => {
        if (result.success) {
          const orderResult = await createOrder({
            discordUsername: customerInfo.discord,
            email: customerInfo.email,
            botId: bot.id,
            botName: bot.name,
            priceSol: priceInSOL,
            walletAddress: paymentAddress,
          })

          if (orderResult.success) {
            await updateOrderStatus(
              orderResult.order.id,
              'confirmed',
              result.signature
            )

            const orderData = {
              ...orderResult.order,
              transaction_signature: result.signature,
            }

            await sendOrderConfirmationEmail(orderData)
            await sendAdminNotificationEmail(orderData)

            window.location.href = `/success?token=${orderResult.order.success_token}`
          } else {
            setPaymentStatus('failed')
          }
        } else {
          setPaymentStatus('failed')
        }
      },
      600
    )
    paymentIntervalRef.current = intervalId
  }

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 42, rotate: index % 2 === 0 ? -1.2 : 1.2 }}
        whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -0.7 : 0.7 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08, duration: 0.45 }}
        whileHover={{ y: -7, rotate: 0 }}
        onClick={() => setShowDetails(true)}
        className="paper-card group cursor-pointer overflow-hidden p-5 sm:p-6"
        style={{ '--bot-accent': bot.accent || '#dee2e6' }}
      >
        <div className="relative z-[1]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div
              className="grid h-16 w-16 place-items-center rounded-md border-2 border-[var(--ink)] text-ink shadow-[5px_5px_0_rgba(33,37,41,0.2)]"
              style={{ backgroundColor: bot.accent || '#dee2e6' }}
            >
              {bot.icon}
            </div>
            <div className="paper-strip bg-[#ffffff] px-3 py-2 text-right">
              <p className="font-mono-ui text-[10px] font-black uppercase text-muted-paper">{bot.label}</p>
              <p className="font-display text-3xl leading-none text-ink">{bot.price}</p>
            </div>
          </div>

          <h3 className="font-display text-5xl uppercase leading-none text-ink">{bot.name}</h3>
          <p className="mt-4 min-h-[72px] text-sm leading-6 text-muted-paper">{bot.description}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <MiniLabel title="Best fit" text={bot.fit} />
            <MiniLabel title="Delivery" text={bot.delivery} />
          </div>

          <div className="mt-6 flex items-center justify-between border-t-2 border-dashed border-[rgba(33,37,41,0.32)] pt-4">
            <span className="font-mono-ui text-xs font-black uppercase text-ink">Inspect package</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-[rgba(33,37,41,0.62)] p-4 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, rotate: -1 }}
              animate={{ scale: 1, opacity: 1, rotate: 0.6 }}
              exit={{ scale: 0.96, opacity: 0, rotate: -1 }}
              onClick={(event) => event.stopPropagation()}
              className="paper-shell max-h-[90vh] w-full max-w-3xl overflow-y-auto bg-[#ffffff] p-5 sm:p-7"
              style={{ '--bot-accent': bot.accent || '#dee2e6' }}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="paper-strip px-3 py-2" style={{ backgroundColor: bot.accent || '#dee2e6' }}>
                  <p className="font-mono-ui text-xs font-black uppercase text-ink">{bot.label}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="grid h-10 w-10 place-items-center rounded-md border-2 border-[var(--ink)] bg-[#ffffff] shadow-[3px_3px_0_rgba(33,37,41,0.18)] transition-colors hover:bg-paper-red hover:text-white"
                  aria-label="Close details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {showCustomerForm ? (
                <form onSubmit={handleCustomerSubmit} className="space-y-6">
                  <div>
                    <h2 className="font-display text-5xl uppercase text-ink">Delivery Details</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-paper">
                      These details connect your payment to the bot delivery email.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block font-mono-ui text-xs font-black uppercase text-muted-paper">Discord username</span>
                      <input
                        type="text"
                        required
                        placeholder="@username"
                        value={customerInfo.discord}
                        onChange={(event) => setCustomerInfo({ ...customerInfo, discord: event.target.value })}
                        className="paper-input w-full px-4 py-3"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block font-mono-ui text-xs font-black uppercase text-muted-paper">Email address</span>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={customerInfo.email}
                        onChange={(event) => setCustomerInfo({ ...customerInfo, email: event.target.value })}
                        className="paper-input w-full px-4 py-3"
                      />
                    </label>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button type="submit" className="paper-button flex-1 px-5 py-3 font-black">
                      Continue to payment
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomerForm(false)}
                      className="paper-button paper-button-light flex-1 px-5 py-3 font-black"
                    >
                      Back to package
                    </button>
                  </div>
                </form>
              ) : !showPayment ? (
                <div className="space-y-7">
                  <div className="grid gap-5 sm:grid-cols-[80px_1fr]">
                    <div
                      className="grid h-20 w-20 place-items-center rounded-md border-2 border-[var(--ink)] text-ink shadow-[5px_5px_0_rgba(33,37,41,0.2)]"
                      style={{ backgroundColor: bot.accent || '#dee2e6' }}
                    >
                      {bot.icon}
                    </div>
                    <div>
                      <h2 className="font-display text-6xl uppercase leading-none text-ink">{bot.name}</h2>
                      <p className="mt-3 font-slab text-lg leading-8 text-muted-paper">{bot.description}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[0.7fr_1.3fr]">
                    <div className="cut-corner border-2 border-[var(--ink)] bg-[#ffffff] p-5 shadow-[5px_5px_0_rgba(33,37,41,0.16)]">
                      <p className="font-mono-ui text-xs font-black uppercase text-muted-paper">One-time payment</p>
                      <p className="font-display text-6xl text-ink">{bot.price}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-paper">Source code, setup guide, and support follow-through.</p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {features.slice(0, 8).map((feature) => (
                        <div key={feature} className="flex items-start gap-2 text-sm leading-6 text-muted-paper">
                          <Check className="mt-1 h-4 w-4 flex-shrink-0 text-ink" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleBuyNow} className="paper-button w-full px-5 py-3 font-black">
                    Buy package
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-5xl uppercase text-ink">Send SOL</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-paper">
                      Send exactly <span className="font-black text-ink">{bot.price}</span> to the merchant wallet. This screen watches for confirmation.
                    </p>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
                    <div className="space-y-4">
                      <div className="cut-corner border-2 border-[var(--ink)] bg-[#ffffff] p-4 shadow-[5px_5px_0_rgba(33,37,41,0.16)]">
                        <p className="mb-2 font-mono-ui text-xs font-black uppercase text-muted-paper">Merchant wallet</p>
                        <div className="flex items-center gap-3">
                          <code className="min-w-0 flex-1 break-all font-mono-ui text-xs text-ink">{paymentAddress}</code>
                          <button
                            onClick={handleCopyAddress}
                            className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-md border-2 border-[var(--ink)] bg-[#ffffff] transition-colors hover:bg-paper-cool"
                            aria-label="Copy wallet address"
                          >
                            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <PaymentStatus icon={<ScanLine />} title="Scan" text="Use Phantom QR" />
                        <PaymentStatus icon={<ClipboardCopy />} title="Copy" text="Paste address" />
                        <PaymentStatus icon={<Clock3 />} title="Wait" text="Up to 10 minutes" />
                      </div>

                      <div className="paper-panel bg-[#ffffff]/90 p-4">
                        <p className="font-mono-ui text-xs font-black uppercase text-muted-paper">Status</p>
                        <p className="mt-1 font-slab text-lg font-bold text-ink">
                          {paymentStatus === 'failed' ? 'Payment was not found in time.' : 'Waiting for payment confirmation...'}
                        </p>
                        {paymentStatus === 'failed' && (
                          <button
                            type="button"
                            onClick={startManualPayment}
                            className="paper-button mt-3 w-full px-4 py-2 text-sm font-black"
                          >
                            <RotateCw className="h-4 w-4" />
                            Try again
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="cut-corner flex flex-col items-center justify-center border-2 border-[var(--ink)] bg-white p-5 shadow-[5px_5px_0_rgba(33,37,41,0.16)]">
                      <QRCodeSVG
                        value={`solana:${paymentAddress}?amount=${bot.price.replace(' SOL', '')}&label=Bot`}
                        size={190}
                        level="H"
                        includeMargin={true}
                      />
                      <p className="mt-3 text-center font-mono-ui text-xs font-black uppercase text-muted-paper">Phantom-ready QR</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPayment(false)}
                    className="paper-button paper-button-light w-full px-5 py-3 font-black"
                  >
                    Back to package
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const MiniLabel = ({ title, text }) => (
  <div className="cut-corner border-2 border-[rgba(33,37,41,0.55)] bg-[#ffffff]/80 p-3">
    <p className="font-mono-ui text-[10px] font-black uppercase text-muted-paper">{title}</p>
    <p className="mt-1 text-xs leading-5 text-ink">{text}</p>
  </div>
)

const PaymentStatus = ({ icon, title, text }) => (
  <div className="cut-corner border-2 border-[var(--ink)] bg-[#ffffff]/90 p-3 shadow-[3px_3px_0_rgba(33,37,41,0.14)]">
    <div className="mb-2 h-5 w-5 text-ink">{icon}</div>
    <p className="font-slab text-base font-bold text-ink">{title}</p>
    <p className="text-xs text-muted-paper">{text}</p>
  </div>
)

export default BotCard
