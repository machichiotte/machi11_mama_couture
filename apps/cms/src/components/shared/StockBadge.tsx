import React from 'react'
import { cn } from '@/lib/utils'

interface StockBadgeProps {
  status: 'hidden' | 'in-stock' | 'sold' | 'on-order'
  quantity?: number | null
  className?: string
}

export const StockBadge: React.FC<StockBadgeProps> = ({ status, quantity, className }) => {
  if (status === 'hidden') return null

  const config = {
    'in-stock': {
      label: quantity && quantity > 0 ? `En stock (${quantity})` : 'En stock',
      classes: 'bg-green-50 text-green-700 border-green-100',
    },
    'sold': {
      label: 'Vendu',
      classes: 'bg-primary/5 text-primary/40 border-primary/10 italic',
    },
    'on-order': {
      label: 'Sur commande',
      classes: 'bg-accent/5 text-accent border-accent/20',
    },
  }[status] || { label: '', classes: '' }

  return (
    <div 
      className={cn(
        "px-3 py-1 text-[10px] uppercase tracking-widest font-bold border rounded-full backdrop-blur-md",
        config.classes,
        className
      )}
    >
      {config.label}
    </div>
  )
}
