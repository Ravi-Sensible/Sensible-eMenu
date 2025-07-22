import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Clock, CheckCircle, Package } from 'lucide-react'
import type { Order } from "../types"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
   const outlet = useSelector((state: RootState) => state.outlet)
  const tableNo = localStorage.getItem("tableNo");
  const navigate = useNavigate()

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    setOrders(savedOrders.reverse())
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "preparing":
        return <Clock className="w-5 h-5 text-orange-500" />
      case "delivered":
        return <Package className="w-5 h-5 text-blue-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center px-4 py-4">
            <button onClick={() => navigate(-1)} className="mr-4">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">Order History</h1>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center h-96 px-4">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-gray-600 text-center mb-6">Your order history will appear here</p>
          <button
            onClick={() => navigate(`/${outlet.id}/${tableNo}/menu`)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Start Ordering
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center px-4 py-4">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Order History</h1>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {orders.map((order) => (
          <div key={order.orderToken} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  {getStatusIcon(order.status)}
                  <span className="font-semibold text-lg">#{order.orderToken}</span>
                </div>
                <p className="text-gray-600 text-sm">{formatDate(order.timestamp)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg text-orange-600">${order.totalAmount.toFixed(2)}</p>
                <p className="text-gray-600 text-sm capitalize">{order.paymentMethod}</p>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Estimated delivery: {order.estimatedDelivery}</span>
                <span className="capitalize font-medium text-green-600">{order.status}</span>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}