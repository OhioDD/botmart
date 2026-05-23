import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Bot, Wallet, PackageCheck, ShoppingBag } from 'lucide-react'
import { useState, useEffect } from 'react'
import { connectWallet, disconnectWallet, isPhantomInstalled } from '../utils/solana'

const Navbar = () => {
  const navigate = useNavigate()
  const [walletAddress, setWalletAddress] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Check if wallet is already connected on load
  useEffect(() => {
    const checkWallet = async () => {
      if (window.solana && window.solana.isConnected) {
        const address = window.solana.publicKey.toString()
        setWalletAddress(address)
      }
    }
    checkWallet()

    // Handle scroll
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleConnectWallet = async () => {
    if (walletAddress) {
      // Disconnect
      await disconnectWallet()
      setWalletAddress(null)
    } else {
      // Connect
      if (!isPhantomInstalled()) {
        alert('Phantom wallet not found! Please install it from phantom.app')
        window.open('https://phantom.app', '_blank')
        return
      }

      setIsConnecting(true)
      const address = await connectWallet()
      if (address) {
        setWalletAddress(address)
      }
      setIsConnecting(false)
    }
  }

  const shortenAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5"
    >
      <div
        className={`mx-auto max-w-7xl border-2 border-[var(--ink)] bg-[#ffffff]/90 px-3 py-2 shadow-[6px_6px_0_rgba(33,37,41,0.18)] backdrop-blur-md transition-all duration-300 sm:px-5 ${
          scrolled ? 'rotate-0 rounded-md' : '-rotate-[0.4deg] rounded-lg'
        }`}
      >
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
            className="flex cursor-pointer items-center gap-2"
          >
            <span className="grid h-10 w-10 place-items-center rounded-md border-2 border-[var(--ink)] bg-paper-yellow shadow-[3px_3px_0_rgba(33,37,41,0.2)]">
              <Bot className="h-6 w-6 text-ink" />
            </span>
            <span className="font-display text-2xl uppercase leading-none text-ink sm:text-3xl">
              Bot Mart
            </span>
          </motion.div>

          <div className="hidden items-center gap-2 md:flex">
            <NavLink onClick={() => navigate('/')}>Floor</NavLink>
            <NavLink onClick={() => navigate('/bots')}>Bots</NavLink>
            <NavLink onClick={() => { navigate('/'); setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 100) }}>How It Works</NavLink>
            <NavLink onClick={() => { navigate('/'); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100) }}>Origin</NavLink>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/bots')}
              className="paper-button paper-button-light px-3 py-2 text-sm font-black md:hidden"
              aria-label="Browse bots"
            >
              <ShoppingBag className="h-4 w-4" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="paper-button px-3 py-2 text-xs font-black uppercase sm:px-4 sm:text-sm"
            >
              {walletAddress ? <PackageCheck className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
              <span className="hidden sm:inline">
                {isConnecting ? 'Linking' : walletAddress ? shortenAddress(walletAddress) : 'Wallet'}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

const NavLink = ({ children, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="rounded-md px-3 py-2 font-mono-ui text-sm font-black uppercase text-ink transition-colors hover:bg-paper-cool"
    >
      {children}
    </motion.button>
  )
}

export default Navbar
