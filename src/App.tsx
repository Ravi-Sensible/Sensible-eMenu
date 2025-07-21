
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <CartProvider>
      <Router>
      <div className="App">
      <Routes>
        <Route path="/:outletId/:tableNo" element={<OutletLoader />}>
          <Route index element={<BootstrapPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          {/* <Route path="orders" element={<OrdersPage />} /> */}
          {/* <Route path="demo" element={<DemoPage />} /> */}
        </Route>
      </Routes>
      <BottomNavigation />
    </div>
      </Router>
    </CartProvider>
  )
}

export default App
