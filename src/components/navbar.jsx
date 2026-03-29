import { useEffect, useState, useRef, useCallback } from 'react'
import { getBotStatus } from '../api/status'
import { images } from '../config/images.config'

export default function Navbar() {
  const [bot, setBot] = useState({ status: false, last_seen: 'unknown', last_ping_iso: null })
  const [showTip, setShowTip] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const mountedRef = useRef(false)

  const fetchStatus = useCallback(async ({ showLoading = false } = {}) => {
    if (showLoading) setIsLoading(true)
    try {
      const res = await getBotStatus()
      if (!mountedRef.current) return
      if (res && typeof res.status !== 'undefined') {
        setBot(res)
      } else {
        setBot(prev => ({ ...prev, status: false }))
      }
    } finally {
      if (mountedRef.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fetchStatus({ showLoading: true })
    const id = setInterval(() => fetchStatus({ showLoading: false }), 30000)
    return () => {
      mountedRef.current = false
      clearInterval(id)
    }
  }, [fetchStatus])

  const formatLocalTime = (iso) => {
    if (!iso) return null
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return iso
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: tz,
      })
    } catch {
      return date.toLocaleString('en-US')
    }
  }

  const dotClass = bot.status ? 'bg-green-400 animate-pulse' : 'bg-red-500'
  const statusText = bot.status ? 'Online' : 'Offline'

  return (
    <nav className="reveal-up flex items-center justify-between border-2 border-zinc-900 bg-zinc-950/70 text-zinc-100 px-4 py-3 rounded-lg shadow-sm m-1">
      <p className="font-kronaone text-xl text-zinc-100">GD KenyBot</p>
      <section role="status" aria-label="connection status" aria-busy={isLoading} className="reveal-soft delay-1 flex items-center border border-zinc-700 bg-zinc-800/60 px-3 py-1 rounded-lg gap-2">
        <div
          className="relative"
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
          onFocus={() => setShowTip(true)}
          onBlur={() => setShowTip(false)}
          tabIndex={0}
        >
          {isLoading ? (
            <div className="flex items-center cursor-default select-none gap-2 h-4">
              <span className="w-3 h-3 bg-zinc-700 rounded-full animate-pulse" aria-hidden="true" />
              <span className="h-3 w-10.5 bg-zinc-700 rounded animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center cursor-default select-none h-4">
              <span className={`w-3 h-3 rounded-full ${dotClass}`} aria-hidden="true" />
              <span className="text-sm text-zinc-200 ml-2">{statusText}</span>
            </div>
          )}

          {showTip && (
            <div className="absolute right-0 mt-2 w-max bg-zinc-900 text-zinc-100 text-xs px-2 py-1 rounded shadow z-50">
              {isLoading ? (
                <div>Loading…</div>
              ) : (
                <>
                  <div>Last response: {bot.last_seen ?? 'unknown'}</div>
                  {bot.last_ping_iso && <div className="text-xs text-zinc-400">at {formatLocalTime(bot.last_ping_iso)} UTC</div>}
                  {bot.error && <div className="text-xs text-red-400">Error</div>}
                </>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => fetchStatus({ showLoading: true })}
          disabled={isLoading}
          className="reveal-soft delay-2 p-1 text-xs text-zinc-200 border border-zinc-700 rounded hover:bg-zinc-700/40 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Refresh status"
        >
          <img src={images.REFRESH} alt="" className='w-4 h-4'/>
        </button>
      </section>
    </nav>
  )
}
