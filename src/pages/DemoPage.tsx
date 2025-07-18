import  { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Play, RotateCcw } from 'lucide-react'

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  const demoSteps = [
    {
      title: "Welcome Screen",
      description: "App starts with animated logo and company branding",
      action: "Auto-redirects to menu after 3 seconds",
      path: "/",
    },
    {
      title: "Menu Browse",
      description: "Browse categories, view items, and add to cart",
      action: "Try adding different items to your cart",
      path: "/menu",
    },
    {
      title: "Cart Management",
      description: "Review items, adjust quantities, and proceed to checkout",
      action: "Manage your cart items and quantities",
      path: "/cart",
    },
    {
      title: "Mobile Number",
      description: "Enter mobile number for order processing (first time only)",
      action: "System remembers your number for future orders",
      path: "/cart",
    },
    {
      title: "Payment Selection",
      description: "Choose from Cash on Delivery, Card, or UPI payment",
      action: "Select your preferred payment method",
      path: "/payment",
    },
    {
      title: "Order Success",
      description: "Get order confirmation with unique token number",
      action: "Order is saved with all details and timestamp",
      path: "/order-success",
    },
    {
      title: "Order History",
      description: "View all your previous orders and their status",
      action: "Track your order history and status",
      path: "/orders",
    },
  ]

  const handleStartDemo = () => {
    localStorage.clear()
    navigate(demoSteps[currentStep].path)
  }

  const handleResetDemo = () => {
    localStorage.clear()
    setCurrentStep(0)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center px-4 py-4">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Demo Guide</h1>
        </div>
      </header>

      <main className="px-4 py-6">
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-2xl font-bold mb-4">🚀 Full Functionality Demo</h2>
          <p className="text-gray-600 mb-4">
            This demo showcases all features of the mobile ordering system with dummy data. Follow the steps below to
            experience the complete user journey.
          </p>

          <div className="flex space-x-4">
            <button
              onClick={handleStartDemo}
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Start Demo</span>
            </button>

            <button
              onClick={handleResetDemo}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Demo Flow:</h3>

          {demoSteps.map((step, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${
                index === currentStep ? "border-orange-500 bg-orange-50" : "border-gray-200"
              }`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === currentStep ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{step.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                  <p className="text-orange-600 text-sm font-medium">{step.action}</p>
                </div>

                {index === currentStep && (
                  <button
                    onClick={() => navigate(step.path)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    Try Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">🎯 Key Features Demonstrated:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Mobile-first responsive design</li>
            <li>• Animated welcome screen</li>
            <li>• Category-based menu browsing</li>
            <li>• Real-time cart management</li>
            <li>• Mobile number persistence</li>
            <li>• Multiple payment options</li>
            <li>• Order confirmation with tokens</li>
            <li>• Order history tracking</li>
            <li>• Bottom navigation</li>
            <li>• Local storage integration</li>
          </ul>
        </div>

        <div className="mt-6 bg-green-50 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">💡 Technical Highlights:</h3>
          <ul className="text-green-700 text-sm space-y-1">
            <li>• React functional components with hooks</li>
            <li>• Context API for state management</li>
            <li>• React Router for navigation</li>
            <li>• Tailwind CSS for styling</li>
            <li>• localStorage for data persistence</li>
            <li>• Responsive mobile-first design</li>
            <li>• Smooth animations and transitions</li>
          </ul>
        </div>
      </main>
    </div>
  )
}