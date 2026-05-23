import { motion } from 'framer-motion'
import { Home, MapPinOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -1.4 }}
        animate={{ opacity: 1, y: 0, rotate: 0.8 }}
        transition={{ duration: 0.55 }}
        className="paper-shell max-w-2xl bg-[#ffffff]/95 p-8 text-center"
      >
        <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-md border-2 border-[var(--ink)] bg-paper-blue shadow-[5px_5px_0_rgba(33,37,41,0.2)]">
          <MapPinOff className="h-10 w-10 text-ink" />
        </div>
        <h1 className="font-display text-8xl uppercase leading-none text-ink sm:text-9xl">404</h1>
        <p className="mx-auto mt-4 max-w-md font-slab text-lg leading-8 text-muted-paper">
          This paper scrap does not belong to the mart.
        </p>

        <button
          onClick={() => navigate('/')}
          className="paper-button mt-7 px-6 py-3 font-black"
        >
          <Home className="h-4 w-4" />
          Back to floor
        </button>
      </motion.div>
    </div>
  )
}

export default NotFoundPage
