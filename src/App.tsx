
import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './hooks/useCart'
import BottomNavigation from './components/BottomNavigation'

// Pages
import BootstrapPage from './pages/BootstrapPage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import PaymentPage from './pages/PaymentPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
// import OrdersPage from './pages/OrdersPage'
import OutletLoader from './components/OutletLoader'
import EMenuPage from './pages/EMenuPage'

function AppRoutes() {
  const location = useLocation()

  // Hide BottomNavigation on /:outletId/eMenu route
  const isEMenu = /^\/[^/]+\/eMenu$/.test(location.pathname)

  return (
    <div className="App">
      <Routes>
        {/* eMenu route */}
        <Route path="/:outletId/eMenu" element={<EMenuPage />} />

        {/* Main flow routes */}
        <Route path="/:outletId/:tableNo" element={<OutletLoader />}>
          <Route index element={<BootstrapPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
        </Route>
      </Routes>

      {/* Conditionally show BottomNavigation */}
      {!isEMenu && <BottomNavigation />}
    </div>
  )
}





function App() {
  return (
     <CartProvider>
      <Router>
        <AppRoutes />
      </Router>
    </CartProvider>
  )
}

export default App
