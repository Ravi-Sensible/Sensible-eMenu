import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { Order } from "../types";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { collection, doc, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function OrdersPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading,setLoading]=useState<boolean>(false)
  const outlet = useSelector((state: RootState) => state.outlet);
  const tableNo = localStorage.getItem("tableNo");
  const navigate = useNavigate();

  let tableNumberOnly = tableNo?.replace(/^table/i, "") || "";
  const groupID = Number(tableNumberOnly);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!outlet.id || !groupID) return;
        setLoading(true)
        const outletRef = doc(db, "OUTLET", outlet.id);
        const captainOrderQuery = query(
          collection(outletRef, "CAPTAIN_ORDER"),
          where("groupID", "==", groupID),
          limit(1)
        );

        const snapshot = await getDocs(captainOrderQuery);

        if (!snapshot.empty) {
          const docData:Order = snapshot.docs[0].data() as Order;
          const details = JSON.parse(docData.tableDetails || "{}");
          const billItems = details.billItems || [];

          const formattedProducts = billItems.map((item: any) => ({
            name: item.name,
            regionalName: item.regionalName,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
          }));

          setProducts(formattedProducts.reverse());
           setLoading(false)
        } else {
          setProducts([]);
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching captain order:", error);
      }
    };

    fetchOrder();
  }, [outlet.id, groupID]);



    if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }


  if (products.length === 0) {
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
          <p className="text-gray-600 text-center mb-6">
            Your order history will appear here
          </p>
          <button
            onClick={() => navigate(`/${outlet.id}/${tableNo}/menu`)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Start Ordering
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
          <h1 className="text-xl font-semibold">Order Summary</h1>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-2 mb-1">
              {/* {status && getStatusIcon(status)} */}
              {/* <span className="font-semibold text-lg">Order </span> */}
                 <span className="font-semibold text-lg"> Total Items: {products?.length}</span>
            </div>
            <div className="text-right">
              <p className="font-semibold text-lg text-orange-600">
                ₹
                {products
                  .reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="space-y-2">
              {products.map((item, index) => (
                <div key={index} className="flex justify-between text-sm border-b">
                  <span>
                    {item.name} <br/><span className="font-semibold text-lg">₹{item.price}</span> X <span className="font-semibold text-lg">{item.quantity}</span>
                  </span>
                  <span className="font-semibold text-base">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
