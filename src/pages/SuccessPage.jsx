import { motion } from 'framer-motion'
import { AlertTriangle, Check, Home, PackageCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../config/supabase'

const SuccessPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setError(true)
      return
    }

    if (token === 'demo') {
      setOrderData({
        bot_name: 'Moderation Pro',
        price_sol: '2.5',
        customer_email: 'demo@example.com',
        customer_discord: '@demouser',
        payment_status: 'confirmed',
      })
      return
    }

    const fetchOrder = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('success_token', token)
          .single()

        if (fetchError || !data || data.token_used) {
          setError(true)
          return
        }

        setOrderData(data)

        await supabase
          .from('orders')
          .update({ token_used: true })
          .eq('id', data.id)
      } catch (err) {
        setError(true)
      }
    }

    fetchOrder()
  }, [searchParams])

  if (!orderData && !error) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="paper-strip bg-paper-yellow px-4 py-2 font-mono-ui text-xs font-black uppercase text-ink">
          Checking order token
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="paper-shell max-w-md bg-[#ffffff]/95 p-7 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-md border-2 border-[var(--ink)] bg-paper-red text-white shadow-[5px_5px_0_rgba(33,37,41,0.2)]">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h1 className="mt-6 font-display text-5xl uppercase text-ink">Invalid Link</h1>
          <p className="mt-3 text-sm leading-6 text-muted-paper">
            This order link is invalid or has already been used.
          </p>
          <button
            onClick={() => navigate('/')}
            className="paper-button mt-6 px-6 py-3 font-black"
          >
            <Home className="h-4 w-4" />
            Back to floor
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 22, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: 0.6 }}
          className="paper-shell bg-[#ffffff]/95 p-6 sm:p-8"
        >
          <div className="mx-auto grid h-28 w-28 place-items-center rounded-md border-2 border-[var(--ink)] bg-paper-cool shadow-[6px_6px_0_rgba(33,37,41,0.2)]">
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 220, damping: 14 }}
            >
              <Check className="h-14 w-14 text-ink" />
            </motion.div>
          </div>

          <div className="mt-7 text-center">
            <p className="paper-strip mx-auto bg-paper-yellow px-3 py-1 font-mono-ui text-xs font-black uppercase text-ink">
              Receipt stamped
            </p>
            <h1 className="mt-4 font-display text-6xl uppercase leading-none text-ink">Payment Confirmed</h1>
            <p className="mx-auto mt-3 max-w-md font-slab text-base leading-7 text-muted-paper">
              Check your email for bot files and setup instructions.
            </p>
          </div>

          <div className="mt-7 grid gap-3">
            <ReceiptRow label="Bot" value={orderData.bot_name} />
            <ReceiptRow label="Amount" value={`${orderData.price_sol} SOL`} />
            <ReceiptRow label="Email" value={orderData.customer_email} />
            <ReceiptRow label="Discord" value={orderData.customer_discord} />
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate('/bots')}
              className="paper-button flex-1 px-5 py-3 font-black"
            >
              <PackageCheck className="h-4 w-4" />
              Browse more bots
            </button>
            <button
              onClick={() => navigate('/')}
              className="paper-button paper-button-light flex-1 px-5 py-3 font-black"
            >
              <Home className="h-4 w-4" />
              Back to floor
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const ReceiptRow = ({ label, value }) => {
  return (
    <div className="cut-corner flex flex-col gap-1 border-2 border-[rgba(33,37,41,0.55)] bg-[#ffffff]/85 p-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="font-mono-ui text-xs font-black uppercase text-muted-paper">{label}</span>
      <span className="break-all font-slab text-base font-bold text-ink">{value}</span>
    </div>
  )
}

export default SuccessPage
