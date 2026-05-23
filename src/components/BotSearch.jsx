import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'

const BotSearch = ({ bots, onFilteredBotsChange }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [resultCount, setResultCount] = useState(bots.length)

  const searchBots = (query) => {
    if (!query.trim()) {
      setResultCount(bots.length)
      onFilteredBotsChange(bots)
      return
    }

    const searchTerms = query.toLowerCase().trim()
    const keywordMap = {
      moderation: ['moderation pro', 'moderate', 'ban', 'kick', 'filter', 'automod', 'content filtering', 'warning', 'raid'],
      music: ['music master', 'audio', 'song', 'play', 'playlist', 'dj', 'streaming'],
      economy: ['economy bot', 'money', 'currency', 'shop', 'gambling', 'leaderboard', 'coins', 'balance'],
      ticket: ['ticket system', 'support', 'help', 'customer service', 'transcript', 'category'],
      admin: ['moderation pro', 'ticket system', 'management', 'control'],
      entertainment: ['music master', 'economy bot', 'fun', 'game'],
      security: ['moderation pro', 'protection', 'safety', 'guard', 'spam', 'raid'],
      management: ['moderation pro', 'ticket system', 'organize', 'manage'],
      support: ['ticket system', 'transcript', 'staff', 'category'],
    }

    const fuzzyMatches = {
      mod: 'moderation',
      mods: 'moderation',
      ban: 'moderation',
      kick: 'moderation',
      song: 'music',
      songs: 'music',
      audio: 'music',
      money: 'economy',
      cash: 'economy',
      coins: 'economy',
      help: 'ticket',
      tickets: 'ticket',
      support: 'ticket',
    }

    const scoredBots = bots.map((bot) => {
      let score = 0
      const haystack = [
        bot.name,
        bot.description,
        bot.label,
        bot.fit,
        bot.delivery,
        ...(bot.highlights || []),
      ].join(' ').toLowerCase()
      const botName = bot.name.toLowerCase()

      if (botName.includes(searchTerms)) score += 100
      if (haystack.includes(searchTerms)) score += 55

      Object.keys(keywordMap).forEach((keyword) => {
        if (searchTerms.includes(keyword)) {
          keywordMap[keyword].forEach((mappedTerm) => {
            if (haystack.includes(mappedTerm)) score += 30
          })
        }
      })

      searchTerms.split(' ').forEach((word) => {
        if (word.length > 2) {
          if (botName.includes(word)) score += 20
          if (haystack.includes(word)) score += 12
        }
      })

      Object.keys(fuzzyMatches).forEach((fuzzy) => {
        if (searchTerms.includes(fuzzy) && haystack.includes(fuzzyMatches[fuzzy])) {
          score += 25
        }
      })

      return { ...bot, score }
    })

    const filtered = scoredBots
      .filter((bot) => bot.score > 0)
      .sort((a, b) => b.score - a.score)

    setResultCount(filtered.length)
    onFilteredBotsChange(filtered)
  }

  const handleSearchChange = (event) => {
    const query = event.target.value
    setSearchQuery(query)
    searchBots(query)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setResultCount(bots.length)
    onFilteredBotsChange(bots)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-8 w-full max-w-4xl"
    >
      <div className="relative">
        <div
          className={`paper-input relative flex items-center transition-transform duration-300 ${
            isFocused ? 'rotate-0' : '-rotate-[0.45deg]'
          }`}
        >
          <Search className="absolute left-5 h-5 w-5 text-ink" />

          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search by problem, bot, or command..."
            className="w-full bg-transparent py-5 pl-14 pr-14 text-base font-black text-ink placeholder:text-muted-paper focus:outline-none"
          />

          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clearSearch}
                className="absolute right-4 grid h-9 w-9 place-items-center rounded-md border-2 border-[var(--ink)] bg-[#ffffff] transition-colors hover:bg-paper-red hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isFocused && !searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="paper-panel absolute top-full z-20 mt-3 w-full bg-[#ffffff]/95 p-4"
            >
              <p className="mb-3 font-mono-ui text-xs font-black uppercase text-muted-paper">Try a shelf pull</p>
              <div className="flex flex-wrap gap-2">
                {['moderation', 'music bot', 'economy system', 'ticket support', 'raid protection', 'transcripts'].map((tip, index) => (
                  <button
                    key={tip}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setSearchQuery(tip)
                      searchBots(tip)
                    }}
                    className={`paper-strip px-3 py-1 text-xs font-black text-ink ${
                      index % 3 === 0 ? 'bg-paper-cool' : index % 3 === 1 ? 'bg-paper-blue' : 'bg-paper-yellow'
                    }`}
                  >
                    {tip}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {searchQuery && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-center font-mono-ui text-xs font-black uppercase text-muted-paper"
          >
            {resultCount} cut{resultCount === 1 ? '' : 's'} match "{searchQuery}"
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default BotSearch
