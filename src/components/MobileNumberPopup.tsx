import React, { useState } from "react"
import { X } from 'lucide-react'

interface MobileNumberPopupProps {
  onSubmit: (mobile: string) => void
  onClose: () => void
}

export default function MobileNumberPopup({ onSubmit, onClose }: MobileNumberPopupProps) {
  const [mobile, setMobile] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!mobile.trim()) {
      setError("Please enter your mobile number")
      return
    }

    if (mobile.length < 10) {
      setError("Please enter a valid mobile number")
      return
    }

    onSubmit(mobile)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Enter Mobile Number</h2>
          <button onClick={onClose} className="text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-600 mb-4">We need your mobile number to process your order and send updates.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="tel"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value)
                setError("")
              }}
              placeholder="Enter your mobile number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              maxLength={15}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold">
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}