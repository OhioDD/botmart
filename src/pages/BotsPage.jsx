import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import BotCard from '../components/BotCard'
import BotSearch from '../components/BotSearch'
import { Bot, Zap, Coins } from 'lucide-react'
import { allBots } from '../data/bots'

const BotsPage = () => {
  const [filteredBots, setFilteredBots] = useState(allBots)

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <section className="px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-7xl"
          >
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <div className="paper-strip bg-paper-yellow px-4 py-2 font-mono-ui text-xs font-black uppercase text-ink">
                  Live bot shelf
                </div>
                <h1 className="mt-5 font-display text-6xl uppercase leading-none text-ink sm:text-7xl lg:text-8xl">
                  Browse The Cuts
                </h1>
              </div>

              <div className="paper-panel bg-[#ffffff]/90 p-5">
                <p className="font-slab text-lg leading-8 text-muted-paper">
                  Search by job, keyword, or server problem. Every listing keeps the one-time SOL price visible and routes into the same QR payment flow.
                </p>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <ShelfStat icon={<Bot />} value="4" label="packages" />
                  <ShelfStat icon={<Zap />} value="24h" label="delivery" />
                  <ShelfStat icon={<Coins />} value="SOL" label="payment" />
                </div>
              </div>
            </div>

            <BotSearch bots={allBots} onFilteredBotsChange={setFilteredBots} />
          </motion.div>
        </section>

        <section className="px-4 pb-16 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono-ui text-xs font-black uppercase text-muted-paper">
                Showing {filteredBots.length} of {allBots.length} bot packages
              </p>
              <p className="font-hand text-lg text-muted-paper">mismatched visuals, matched checkout rules</p>
            </div>

            <AnimatePresence mode="wait">
              {filteredBots.length > 0 ? (
                <motion.div
                  key="bots-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                  {filteredBots.map((bot, index) => (
                    <BotCard key={bot.id} bot={bot} index={index} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="py-16"
                >
                  <div className="paper-shell mx-auto max-w-md bg-[#ffffff]/90 p-8 text-center">
                    <p className="font-display text-5xl uppercase text-ink">No Cut Found</p>
                    <p className="mt-3 text-sm leading-6 text-muted-paper">Try moderation, music, economy, ticket, security, support, or management.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <footer className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl border-t-2 border-dashed border-[rgba(33,37,41,0.35)] pt-6 text-center font-mono-ui text-xs font-black uppercase text-muted-paper">
          Bot Mart checkout is one-time SOL with source delivery.
        </div>
      </footer>
    </div>
  )
}

const ShelfStat = ({ icon, value, label }) => {
  return (
    <div className="cut-corner border-2 border-[var(--ink)] bg-[#ffffff]/90 p-3 shadow-[3px_3px_0_rgba(33,37,41,0.14)] transition-transform hover:-translate-y-1 hover:rotate-0">
      <div className="mb-2 h-5 w-5 text-ink">{icon}</div>
      <p className="font-display text-3xl leading-none text-ink">{value}</p>
      <p className="font-mono-ui text-[10px] font-black uppercase text-muted-paper">{label}</p>
    </div>
  )
}

export default BotsPage
