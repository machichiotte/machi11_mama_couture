import React from 'react'
import { cn } from '@/lib/utils'

interface PriceDisplayProps {
  price?: number | null
  promoPercentage?: string | null
  className?: string
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, promoPercentage, className }) => {
  if (price === undefined || price === null) return (
    <div className={cn("bg-white/90 backdrop-blur-md px-3 py-1 rounded-sm shadow-sm", className)}>
        <span className="text-primary font-serif italic text-sm">Sur devis</span>
    </div>
  )

  const promo = promoPercentage ? parseInt(promoPercentage) : 0
  const finalPrice = promo > 0 ? price * (1 - promo / 100) : price

  return (
    <div className={cn("bg-white/90 backdrop-blur-md px-3 py-2 rounded-sm shadow-sm flex flex-col items-end", className)}>
      {promo > 0 && (
        <span className="text-[10px] text-primary/40 line-through decoration-accent/40 mb-0.5">
          {price.toFixed(2)}€
        </span>
      )}
      <span className="text-primary font-serif font-bold text-base">
        {finalPrice.toFixed(2)}€
      </span>
    </div>
  )
}
