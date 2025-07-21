import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import MobileNumberPopup from "../components/MobileNumberPopup";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from '../redux/store';
import { removeFromCart, updateQuantity } from "../redux/slices/cartSlice";

export default function CartPage() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const outlet = useSelector((state: RootState) => state.outlet);
  const dispatch = useDispatch();
 const tableNo = localStorage.getItem("tableNo");
 
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const navigate = useNavigate();

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleProceedToCheckout = () => {
    const savedMobile = localStorage.getItem("customerMobile");
    if (!savedMobile) {
      setShowMobilePopup(true);
    } else {
      navigate(`/${outlet.id}/${tableNo}/payment`);
    }
  };

  const handleMobileSubmit = (mobile: string) => {
    localStorage.setItem("customerMobile", mobile);
    setShowMobilePopup(false);
    navigate(`/${outlet.id}/${tableNo}/payment`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center px-4 py-4">
            <button onClick={() => navigate(-1)} className="mr-4">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">Your Cart</h1>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center h-96 px-4">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 text-center mb-6">
            Add some delicious items to get started
          </p>
          <button
            onClick={() => navigate(`/${outlet.id}/${tableNo}/menu`)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center px-4 py-4">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Your Cart</h1>
        </div>
      </header>

      <main className="px-4 py-4 pb-32">
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-orange-600 font-semibold">
                    Rs.{item.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-red-500 p-1"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    disabled={item.quantity==1}
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: item.quantity - 1,
                        })
                      )
                    }
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-lg">{item.quantity}</span>
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: item.quantity + 1,
                        })
                      )
                    }
                    className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    Rs.{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total</span>
            <span className="text-orange-600">Rs.{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </main>

      <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4">
        <button
          onClick={handleProceedToCheckout}
          className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold text-lg"
        >
          Proceed to Checkout
        </button>
      </div>

      {showMobilePopup && (
        <MobileNumberPopup
          onSubmit={handleMobileSubmit}
          onClose={() => setShowMobilePopup(false)}
        />
      )}
    </div>
  );
}
