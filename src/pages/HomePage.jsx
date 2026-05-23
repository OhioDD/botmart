import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
  ArrowRight,
  Bot,
  Code2,
  Coins,
  MailCheck,
  PackageCheck,
  Receipt,
  Server,
  Shield,
  Terminal,
  Zap,
} from 'lucide-react'

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <section className="relative px-4 pb-14 pt-28 sm:px-6 sm:pt-32 lg:pb-20">
          <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75 }}
              className="space-y-7"
            >
              <div className="paper-strip bg-paper-red px-4 py-2 font-mono-ui text-xs font-black uppercase text-white sm:text-sm">
                Source code, receipts, no subscription fog
              </div>

              <div>
                <RansomTitle
                  text="Bot Mart For Serious Discord Operators"
                  className="text-[4.2rem] font-black uppercase text-ink sm:text-[5.8rem] lg:text-[7.2rem]"
                />
                <p className="mt-5 max-w-2xl font-slab text-lg leading-8 text-muted-paper sm:text-xl">
                  Premium Discord bot packages sold as complete codebases. Pay in SOL, get the files, run them on your own infrastructure, and keep control.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/bots')}
                  className="paper-button px-6 py-3 text-base font-black"
                >
                  Open the shelf
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="paper-button paper-button-light px-6 py-3 text-base font-black"
                >
                  See delivery rules
                </motion.button>
              </div>

              <div className="grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ['4', 'bot packages'],
                  ['SOL', 'checkout rail'],
                  ['24h', 'file delivery'],
                  ['full', 'source ownership'],
                ].map(([value, label], index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.08 }}
                    whileHover={{ y: -4, rotate: 0 }}
                    className={'paper-card px-4 py-3 transition-transform ' + (index % 2 ? 'tilt-right' : 'tilt-left')}
                  >
                    <p className="font-display text-3xl uppercase text-ink">{value}</p>
                    <p className="font-mono-ui text-xs font-black uppercase text-muted-paper">{label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, rotate: 2, y: 28 }}
              animate={{ opacity: 1, rotate: -1.5, y: 0 }}
              transition={{ delay: 0.12, duration: 0.8 }}
              className="paper-shell paper-grid relative min-h-[520px] overflow-hidden p-5 sm:p-7"
            >
              <div className="absolute -right-10 top-10 h-32 w-44 rotate-12 border-2 border-[var(--ink)] bg-paper-blue shadow-[6px_6px_0_rgba(33,37,41,0.16)]" />
              <div className="absolute -bottom-7 left-8 h-28 w-48 -rotate-6 border-2 border-[var(--ink)] bg-paper-green shadow-[6px_6px_0_rgba(33,37,41,0.16)]" />

              <div className="relative flex h-full flex-col justify-between gap-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="paper-strip bg-paper-yellow px-3 py-1 font-mono-ui text-xs font-black uppercase text-ink">
                      Featured build
                    </div>
                    <h2 className="mt-5 font-display text-5xl uppercase leading-none text-ink sm:text-6xl">
                      Moderation Pro
                    </h2>
                    <p className="mt-4 max-w-md text-base leading-7 text-muted-paper">
                      AI filtering, raid alerts, warnings, slash commands, logging, role controls, and a setup script designed for a real Discord server owner.
                    </p>
                  </div>
                  <div className="grid h-16 w-16 place-items-center rounded-md border-2 border-[var(--ink)] bg-ink bg-[var(--ink)] text-white shadow-[5px_5px_0_rgba(33,37,41,0.2)]">
                    <Shield className="h-8 w-8" />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['AI provider switch', 'Gemini, OpenAI, Anthropic, Cohere'],
                    ['Auto actions', 'Spam timeout, warnings, bans, kicks'],
                    ['Operator logs', 'Server events and moderation actions'],
                    ['Setup script', 'Prompts for tokens, roles, channels'],
                  ].map(([title, detail], index) => {
                    const tiltClass = index % 2 ? 'rotate-[1deg]' : '-rotate-[0.8deg]'
                    return (
                      <div
                        key={title}
                        className={'cut-corner border-2 border-[var(--ink)] bg-[#ffffff]/90 p-4 shadow-[4px_4px_0_rgba(33,37,41,0.14)] transition-transform hover:-translate-y-1 hover:rotate-0 ' + tiltClass}
                      >
                        <p className="font-mono-ui text-xs font-black uppercase text-muted-paper">{String(index + 1).padStart(2, '0')}</p>
                        <h3 className="mt-1 font-slab text-lg font-bold text-ink">{title}</h3>
                        <p className="mt-1 text-sm leading-6 text-muted-paper">{detail}</p>
                      </div>
                    )
                  })}
                </div>

                <div className="flex flex-col gap-3 border-t-2 border-dashed border-[rgba(33,37,41,0.35)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono-ui text-xs font-black uppercase text-muted-paper">One-time price</p>
                    <p className="font-display text-5xl text-ink">2.5 SOL</p>
                  </div>
                  <button onClick={() => navigate('/bots')} className="paper-button px-5 py-3 font-black">
                    Inspect listing
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-hand text-xl text-muted-paper">what the mart refuses to hide</p>
                <h2 className="font-display text-5xl uppercase text-ink sm:text-6xl">Shelf Standards</h2>
              </div>
              <p className="max-w-xl font-slab text-base leading-7 text-muted-paper">
                The front end is loud, but the business rules are plain: source code, setup docs, transparent crypto payment, and no forced hosting lock-in.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <FeatureCard
                icon={<Coins className="h-8 w-8" />}
                title="SOL-first checkout"
                description="Manual QR payment monitoring keeps the flow simple for customers without bank or card rails."
                accent="bg-paper-yellow"
                rotate="-rotate-[1.2deg]"
              />
              <FeatureCard
                icon={<PackageCheck className="h-8 w-8" />}
                title="Delivered as files"
                description="Customers receive source, configuration, setup notes, and ownership of their own hosting choices."
                accent="bg-paper-cool"
                rotate="rotate-[0.8deg]"
              />
              <FeatureCard
                icon={<Zap className="h-8 w-8" />}
                title="Support after sale"
                description="The offer is not a mystery box. Buyers get setup help and a clear path when something breaks."
                accent="bg-paper-blue"
                rotate="-rotate-[0.5deg]"
              />
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="paper-shell bg-[#ffffff]/90 p-5 sm:p-8">
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="paper-strip bg-paper-red px-3 py-1 font-mono-ui text-xs font-black uppercase text-white">
                    Checkout choreography
                  </p>
                  <h2 className="mt-4 font-display text-5xl uppercase text-ink sm:text-6xl">How It Ships</h2>
                </div>
                <p className="max-w-md text-sm leading-6 text-muted-paper">
                  This keeps the marketplace honest: choose, pay, confirm, receive, host.
                </p>
              </div>

              <div className="grid gap-4">
                <ProcessStep
                  number="01"
                  icon={<Bot className="h-6 w-6" />}
                  title="Choose the bot"
                  description="Search or browse the shelf. Each listing explains the job it handles and the package you receive."
                />
                <ProcessStep
                  number="02"
                  icon={<Receipt className="h-6 w-6" />}
                  title="Leave contact details"
                  description="Discord username and email are collected before payment so the order can be matched and delivered."
                />
                <ProcessStep
                  number="03"
                  icon={<Coins className="h-6 w-6" />}
                  title="Send SOL"
                  description="Scan the Phantom-ready QR code or copy the wallet address. The app monitors the payment window."
                />
                <ProcessStep
                  number="04"
                  icon={<MailCheck className="h-6 w-6" />}
                  title="Receive the package"
                  description="After confirmation, the order record is updated and confirmation emails are sent for delivery follow-through."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="font-hand text-xl text-muted-paper">inside the code envelope</p>
              <h2 className="font-display text-5xl uppercase text-ink sm:text-6xl">Proof Points</h2>
              <p className="mt-5 font-slab text-base leading-7 text-muted-paper">
                The bundled moderation project is a Python Discord bot with cogs, local data stores, structured logging, and setup prompts. The marketplace copy now reflects that actual shape.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SpecShard icon={<Terminal />} title="Slash commands" text="/kick, /ban, /timeout, /purge, /warn, filters, and warning inspection." tone="bg-paper-blue" />
              <SpecShard icon={<Code2 />} title="Cog structure" text="Moderation, automod, logging, warnings, filters, and admin modules." tone="bg-paper-cool" />
              <SpecShard icon={<Shield />} title="AI moderation" text="Provider prompt setup for content filtering with high-confidence action rules." tone="bg-paper-yellow" />
              <SpecShard icon={<Server />} title="Self hosting" text="Run it on a VPS or your chosen host after configuring tokens and channel IDs." tone="bg-paper-red text-white" />
            </div>
          </div>
        </section>

        <section id="about" className="px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="paper-panel ragged-bottom bg-[#ffffff]/90 p-6 sm:p-8">
              <p className="paper-strip bg-paper-green px-3 py-1 font-mono-ui text-xs font-black uppercase text-white">
                Origin note
              </p>
              <h2 className="mt-5 font-display text-5xl uppercase text-ink sm:text-6xl">Built For Control</h2>
              <div className="mt-6 grid gap-5 text-base leading-7 text-muted-paper md:grid-cols-2">
                <p>
                  Bot Mart is positioned for buyers who want working bot code instead of another rented dashboard. It treats delivery, hosting, and customization as first-class parts of the sale.
                </p>
                <p>
                  The personality is intentionally uneven: cut paper shapes, mismatched type, stamped labels, and code-shop details. The disorder is visual; the transaction path stays direct.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <p className="font-hand text-xl text-muted-paper">read before checkout</p>
              <h2 className="font-display text-5xl uppercase text-ink sm:text-6xl">Buyer Notes</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <NoteCard title="You host it" text="The package gives you the code and setup guide. Runtime infrastructure is your responsibility." />
              <NoteCard title="You can edit it" text="Since the source is delivered, customization is part of the value instead of an upgrade gate." />
              <NoteCard title="You keep the record" text="Confirmed orders land in Supabase with wallet address, transaction signature, and success token." />
            </div>
          </div>
        </section>
      </main>

      <footer className="px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t-2 border-dashed border-[rgba(33,37,41,0.35)] pt-6 text-sm text-muted-paper sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono-ui font-black uppercase">Bot Mart / Solana checkout / 2026</p>
          <p className="font-hand text-lg">Cut paper outside, clean order trail inside.</p>
        </div>
      </footer>
    </div>
  )
}

const RansomTitle = ({ text, className }) => {
  return (
    <h1 className={'ransom-title ' + className}>
      {text.split(' ').map((word) => (
        <span key={word}>{word}</span>
      ))}
    </h1>
  )
}

const FeatureCard = ({ icon, title, description, accent, rotate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, rotate: 0 }}
      className={'paper-card ' + rotate + ' overflow-hidden p-6 transition-transform'}
    >
      <div className={'mb-5 grid h-14 w-14 place-items-center rounded-md border-2 border-[var(--ink)] ' + accent + ' text-ink shadow-[4px_4px_0_rgba(33,37,41,0.18)]'}>
        {icon}
      </div>
      <h3 className="font-slab text-2xl font-bold text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-paper">{description}</p>
    </motion.div>
  )
}

const ProcessStep = ({ number, icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      whileHover={{ x: 5 }}
      className="group grid gap-4 border-t-2 border-dashed border-[rgba(33,37,41,0.32)] py-5 sm:grid-cols-[76px_1fr_48px] sm:items-center"
    >
      <div className="font-display text-5xl leading-none text-ink">{number}</div>
      <div>
        <h3 className="font-slab text-2xl font-bold text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-muted-paper">{description}</p>
      </div>
      <div className="symbol-stamp grid h-12 w-12 place-items-center rounded-md border-2 border-[var(--ink)] bg-[#ffffff] shadow-[4px_4px_0_rgba(33,37,41,0.16)]">
        {icon}
      </div>
    </motion.div>
  )
}

const SpecShard = ({ icon, title, text, tone }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ rotate: 0, y: -4, scale: 1.015 }}
      className={'proof-shard group cut-corner border-2 border-[var(--ink)] p-5 shadow-[6px_6px_0_rgba(33,37,41,0.18)] ' + tone}
    >
      <div className="symbol-stamp mb-4 grid h-11 w-11 place-items-center rounded-md border-2 border-[var(--ink)] bg-[#ffffff]/80 shadow-[3px_3px_0_rgba(33,37,41,0.14)]">
        {icon}
      </div>
      <h3 className="font-slab text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 opacity-80">{text}</p>
    </motion.div>
  )
}

const NoteCard = ({ title, text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, rotate: 0 }}
      className="paper-card p-6 transition-transform"
    >
      <h3 className="font-display text-3xl uppercase text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-paper">{text}</p>
    </motion.div>
  )
}

export default HomePage
