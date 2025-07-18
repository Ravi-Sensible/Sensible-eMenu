import { useLocation, useNavigate } from "react-router-dom"
import { Home, ShoppingCart, Clock, UtensilsCrossed, Play } from 'lucide-react'
import { useSelector } from "react-redux"
import type { RootState } from "@reduxjs/toolkit/query"

export default function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const cart = useSelector((state: RootState) => state.cart.items)
const outlet = useSelector((state: RootState) => state.outlet)
  const navItems = [
    { id: "home", label: "Home", icon: Home, path: `/${outlet.id}` },
    { id: "menu", label: "Menu", icon: UtensilsCrossed, path:  `/${outlet.id}/menu` },
    { id: "cart", label: "Cart", icon: ShoppingCart, path: `/${outlet.id}/cart`, badge: cart.length },
    { id: "orders", label: "Orders", icon: Clock, path: `/${outlet.id}/orders`},
    // { id: "demo", label: "Demo", icon: Play, path: "/demo" },
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  // Don't show bottom navigation on bootstrap page initially
  if (location.pathname === "/" && !location.state?.showNav) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = location.pathname === item.path

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`flex-1 py-2 px-1 flex flex-col items-center justify-center min-h-[60px] ${
                isActive ? "text-orange-500" : "text-gray-500"
              }`}
            >
              <div className="relative">
                <IconComponent className="w-6 h-6" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}