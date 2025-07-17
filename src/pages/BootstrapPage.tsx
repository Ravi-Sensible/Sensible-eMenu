import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function BootstrapPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoaded(true)
    const timer = setTimeout(() => {
      navigate("/menu")
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center p-4">
      <div className="text-center">
        <div
          className={`transition-all duration-1000 ease-out ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-6xl">🍽️</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">FoodieExpress</h1>
          <p className="text-white/80 text-lg">Delicious food, delivered fast</p>
          <div className="mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  )
}