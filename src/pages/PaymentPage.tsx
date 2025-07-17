import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, CreditCard, Smartphone, Banknote } from 'lucide-react'
import { useCart } from "../hooks/useCart"

const paymentMethods = [
  { id: "cash", name: "Cash on Delivery", icon: Banknote, description: "Pay when your order arrives" },
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, description: "Secure card payment" },
  { id: "upi", name: "UPI Payment", icon: Smartphone, description: "Pay using UPI apps" },
]

export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const { cart } = useCart()
  const navigate = useNavigate()

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const handlePlaceOrder = () => {
    if (!selectedMethod) return

    localStorage.setItem("selectedPaymentMethod", selectedMethod)
    navigate("/order-success")
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center px-4 py-4">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Payment</h1>
        </div>
      </header>

      <main className="px-4 py-6 pb-32">
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-orange-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select Payment Method</h2>

          {paymentMethods.map((method) => {
            const IconComponent = method.icon
            return (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`bg-white rounded-lg p-4 shadow-sm border-2 cursor-pointer transition-colors ${
                  selectedMethod === method.id ? "border-orange-500 bg-orange-50" : "border-transparent"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedMethod === method.id ? "bg-orange-500 text-white" : "bg-gray-100"
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{method.name}</h3>
                    <p className="text-gray-600 text-sm">{method.description}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      selectedMethod === method.id ? "border-orange-500 bg-orange-500" : "border-gray-300"
                    }`}
                  >
                    {selectedMethod === method.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4">
        <button
          onClick={handlePlaceOrder}
          disabled={!selectedMethod}
          className={`w-full py-4 rounded-lg font-semibold text-lg ${
            selectedMethod ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Place Order - ${totalAmount.toFixed(2)}
        </button>
      </div>
    </div>
  )
}