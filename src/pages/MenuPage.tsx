import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import BannerCarousel from "../components/BannerCarousel"
import CategorySlider from "../components/CategorySlider"
import MenuItemCard from "../components/MenuItemCard"
import { useCart } from "../hooks/useCart"
import { categories, menuItems } from "../utils/dummyData"
import type { MenuItem } from "../types"

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart()
  const navigate = useNavigate()

  const allCategories = [{ id: "all", name: "All" }, ...categories]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const filteredItems =
    selectedCategory === "all" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  const getItemQuantity = (itemId: string) => {
    return cart.find((item) => item.id === itemId)?.quantity || 0
  }

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item)
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId)
    } else {
      updateQuantity(itemId, quantity)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pb-20">
        <BannerCarousel />

        <div className="px-4 py-4">
          <CategorySlider
            categories={allCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>

        <div className="px-4 space-y-4">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              quantity={getItemQuantity(item.id)}
              onAddToCart={() => handleAddToCart(item)}
              onUpdateQuantity={(quantity) => handleUpdateQuantity(item.id, quantity)}
            />
          ))}
        </div>
      </main>

      {cart.length > 0 && (
        <div className="fixed bottom-16 left-4 right-4 z-40">
          <button
            onClick={() => navigate("/cart")}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold shadow-lg flex items-center justify-between"
          >
            <span>View Cart ({cart.length} items)</span>
            <span>${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  )
}