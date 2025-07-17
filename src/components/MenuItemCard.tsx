import React from "react"
import { Plus, Minus } from 'lucide-react'
import type { MenuItem } from "../types"

interface MenuItemCardProps {
  item: MenuItem
  quantity: number
  onAddToCart: () => void
  onUpdateQuantity: (quantity: number) => void
}

export default function MenuItemCard({ item, quantity, onAddToCart, onUpdateQuantity }: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex space-x-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
          {item.description && <p className="text-gray-600 text-sm mb-2">{item.description}</p>}
          <p className="text-orange-600 font-bold text-lg">${item.price.toFixed(2)}</p>
        </div>

        {item.image && (
          <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🍽️</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        {quantity === 0 ? (
          <button onClick={onAddToCart} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold">
            Add
          </button>
        ) : (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onUpdateQuantity(quantity - 1)}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-semibold text-lg">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}