import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Banknote,
  Flag,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@reduxjs/toolkit/query";
import { v4 as uuidv4 } from "uuid"; // for generating order IDs
import dayjs from "dayjs"; // optional, for formatting
import { addDoc, collection, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { clearCart } from "../redux/slices/cartSlice";

const paymentMethods = [
  {
    id: "cash",
    name: "Cash on Delivery",
    icon: Banknote,
    description: "Pay when your order arrives",
  },
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Secure card payment",
  },
  {
    id: "upi",
    name: "UPI Payment",
    icon: Smartphone,
    description: "Pay using UPI apps",
  },
];

export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const cart = useSelector((state: RootState) => state.cart.items);
  const outlet = useSelector((state: RootState) => state.outlet);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 const dispatch = useDispatch()
  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // const handlePlaceOrder = () => {
  //   if (!selectedMethod) return

  //   localStorage.setItem("selectedPaymentMethod", selectedMethod)
  //   navigate("/order-success")
  // }

  const handlePlaceOrder = async () => {
    if (!selectedMethod) return;
    setLoading(true);
    const mobile = localStorage.getItem("customerMobile");
    if (!mobile || cart.length === 0 || !outlet.id) return;

    const orderId = uuidv4(); // or your own logic
    const orderDateTime = Date.now().toString();

    const orderItems = cart.map((item) => ({
      addons: [],
      cgst: 0,
      cgst_percent: 0,
      discount: 0,
      dish: [],
      gst: 0,
      gst_percent: 0,
      instructions: "",
      item_id: item.id,
      item_name: item.name,
      item_quantity: item.quantity,
      item_unit_price: item.price,
      packaging: 0,
      packaging_cgst: 0,
      packaging_cgst_percent: 0,
      packaging_gst: 0,
      packaging_sgst: 0,
      packaging_sgst_percent: 0,
      sgst: 0,
      sgst_percent: 0,
      subtotal: item.quantity * item.price,
      variants: [],
      wera_item_id: 0,
    }));

    const orderPayload = {
      cgst: 0,
      customer_details: {
        address: "",
        address_type: "",
        city: "",
        country: "India",
        customer_id: "",
        delivery_area: "",
        delivery_coordinates_type: "",
        name: "",
        order_instructions: "",
        phone_number: mobile,
        pincode: "",
        state: "",
      },
      dayId: dayjs().format("YYYY-MM-DD"),
      delivery_charge: 0,
      discount: 0,
      discount_reason: "",
      enable_delivery: 0,
      expected_delivery_time: "",
      external_order_id: "",
      foodready: 0,
      gross_amount: cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      gst: 0,
      id: orderId,
      is_bill_printed: false,
      is_edit: false,
      is_kot_printed: false,
      is_pop_order: false,
      net_amount: cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      order_date_time: orderDateTime,
      order_from: "WEB_APP",
      order_id: Math.floor(Math.random() * 1000000), // or use timestamp
      order_instructions: "",
      order_items: orderItems,
      order_otp: "",
      order_packaging: 0,
      order_taker: false,
      order_type: "ONLINE",
      packaging: 0,
      packaging_cgst: 0,
      packaging_cgst_percent: 0,
      packaging_sgst: 0,
      packaging_sgst_percent: 0,
      payment_mode: selectedMethod,
      rStatus: "PENDING",
      rejection_id: 0,
      rejection_msg: "",
      restaurant_address: "",
      restaurant_id: 0,
      restaurant_name: outlet.name,
      restaurant_number: "",
      rider: {
        arrival_time: "",
        is_rider_available: false,
        otp: "",
        otp_message: "",
        rider_name: "",
        rider_number: "",
        rider_status: "pending",
        time_to_arrive: "",
      },
      sgst: 0,
      showOTP: "",
      status: "pending",
      taxes: [],
    };

    try {
      const outletRef = doc(db, "OUTLET", outlet.id);
      await addDoc(collection(outletRef, "ONLINE_ORDERS"), orderPayload);
      dispatch(clearCart())
      setLoading(false);
      localStorage.setItem("selectedPaymentMethod", selectedMethod);
      navigate(`/${outlet.id}/order-success`);
      // navigate("/order-success")
    } catch (error) {
      setLoading(false);
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

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
                <span>Rs.{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-orange-600">
                Rs.{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select Payment Method</h2>

          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`bg-white rounded-lg p-4 shadow-sm border-2 cursor-pointer transition-colors ${
                  selectedMethod === method.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-transparent"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedMethod === method.id
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{method.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {method.description}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      selectedMethod === method.id
                        ? "border-orange-500 bg-orange-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedMethod === method.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4">
        <button
          onClick={handlePlaceOrder}
          disabled={!selectedMethod || loading}
          className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center ${
            selectedMethod && !loading
              ? "bg-orange-500 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
          ) : (
            <>Place Order - Rs.{totalAmount.toFixed(2)}</>
          )}
        </button>
      </div>
    </div>
  );
}
