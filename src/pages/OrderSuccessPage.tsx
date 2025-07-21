// import  { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle, Home } from 'lucide-react'
// import { useCart } from "../hooks/useCart"
import { useSelector } from "react-redux"
import type { RootState } from '../redux/store';

export default function OrderSuccessPage() {
  // const [orderToken, setOrderToken] = useState<string>("")
   const tableNo = localStorage.getItem("tableNo");
    const outlet = useSelector((state: RootState) => state.outlet)
  // const { cart, clearCart } = useCart()
  const navigate = useNavigate()

  // useEffect(() => {
  //   saveOrder()
  // }, [])

  // const generateOrderToken = () => {
  //   return Math.floor(1000 + Math.random() * 9000).toString()
  // }

  // const saveOrder = () => {
  //   const token = generateOrderToken()
  //   const mobileNumber = localStorage.getItem("customerMobile") || ""
  //   const paymentMethod = localStorage.getItem("selectedPaymentMethod") || "cash"
  //   const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  //   const orderData = {
  //     orderToken: token,
  //     mobileNumber,
  //     items: cart,
  //     totalAmount,
  //     paymentMethod,
  //     timestamp: new Date().toISOString(),
  //     status: "confirmed",
  //     estimatedDelivery: "25-30 minutes",
  //     restaurantInfo: {
  //       name: "FoodieExpress",
  //       branch: "Downtown Branch",
  //       address: "123 Main Street, Downtown",
  //     },
  //   }

  //   // Save to localStorage (simulating database)
  //   const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
  //   existingOrders.push(orderData)
  //   localStorage.setItem("orders", JSON.stringify(existingOrders))
  //   setOrderToken(token)
  //   clearCart()
  //   localStorage.removeItem("selectedPaymentMethod")
  // }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pb-20">
      <div className="bg-white rounded-lg p-8 shadow-lg text-center max-w-md w-full">
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Thank you for your order. We'll prepare it with care.</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-orange-800 mb-2">Order Token</h2>
          <div className="text-3xl font-bold text-orange-600">on {tableNo?.toLocaleUpperCase()}</div>
          {/* <p className="text-sm text-orange-700 mt-2">Please save this token for order tracking</p> */}
        </div>

        <div className="space-y-4">
          <button
            onClick={() =>  navigate(`/${outlet.id}/${tableNo}`)}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold"
          >
            Order Again
          </button>

          <button
            onClick={() => navigate(`/${outlet.id}/${tableNo}`)}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Estimated delivery time: 10-30 minutes</p>
        </div>
      </div>
    </div>
  )
}