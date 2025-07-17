import React, { useState, useEffect } from "react"
import { banners } from "../utils/dummyData"

export default function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-48 overflow-hidden bg-gradient-to-r from-orange-400 to-red-500">
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="w-full flex-shrink-0 relative">
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-2">{banner.title}</h2>
                <p className="text-lg">{banner.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full ${currentSlide === index ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  )
}