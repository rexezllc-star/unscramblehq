'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[]
  }
}

type AdSlotProps = {
  slot?: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical'
  responsive?: boolean
  className?: string
  label?: string
}

export function AdSlot({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  label = 'Advertisement',
}: AdSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

  useEffect(() => {
    if (!client || !slot) return

    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch (error) {
      console.error('AdSense initialization failed:', error)
    }
  }, [client, slot])

  if (!client || !slot) return null

  return (
    <aside
      aria-label={label}
      className={`my-8 overflow-hidden rounded-2xl border border-line bg-white p-3 ${className}`}
    >
      <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {label}
      </p>

      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </aside>
  )
}