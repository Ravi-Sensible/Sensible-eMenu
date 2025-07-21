import  { useState, useEffect } from "react";
import {useNavigate } from "react-router-dom";
import { doc, collection, getDoc, getDocs } from "firebase/firestore";
import Header from "../components/Header";
import BannerCarousel from "../components/BannerCarousel";
import CategorySlider from "../components/CategorySlider";
import MenuItemCard from "../components/MenuItemCard";
import type { MenuItem } from "../types";
import { db } from "../lib/firebase";
import type { RootState } from '../redux/store';
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, updateQuantity } from "../redux/slices/cartSlice";

export default function MenuPage() {
      const outlet = useSelector((state: RootState) => state.outlet)
      const outletId=outlet?.id
  // const { outletId = "6QDWpN5HHvAbN7OwSyRz" } = useParams();
  const navigate = useNavigate();
 const tableNo = localStorage.getItem("tableNo");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [outletInfo, setOutletInfo] = useState({});
    const dispatch = useDispatch()
  const cart = useSelector((state: RootState) => state.cart.items)


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch outlet validation
        const outletRef = doc(db, "OUTLET", outletId);
        const outletSnap = await getDoc(outletRef);
        if (!outletSnap.exists()) {
          setError("Outlet not found");
          setLoading(false);
          return;
        }
        setOutletInfo(outletSnap.data());

        // Fetch categories
        const catRef = collection(db, "OUTLET", outletId, "CATEGORY");
        const catSnap = await getDocs(catRef);
        const catList = catSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as { id: string; name: string }[];
        setCategories([{ id: "all", name: "All" }, ...catList]);

        // Fetch products
        const prodRef = collection(db, "OUTLET", outletId, "PRODUCT");
        const prodSnap = await getDocs(prodRef);
        const prodList = prodSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MenuItem[];
        setProducts(prodList);
      } catch (err) {
        console.error("Error fetching menu data:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [outletId]);

  const filteredItems = products
    .filter((item) =>
      selectedCategory === "all" ? true : item.category === selectedCategory
    )
    .filter((item) =>
      searchQuery
        ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

    
  const getItemQuantity = (itemId: string) =>
    cart.find((item) => item.id === itemId)?.quantity || 0;

  const handleAddToCart = (item: MenuItem) => {
    // addToCart(item);
     dispatch(addToCart(item))
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      dispatch(removeFromCart(id))
    } else {
      // updateQuantity(itemId, quantity);
      dispatch(updateQuantity({ id, quantity }))
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        outlet={outletInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="pb-20">
        {/* <BannerCarousel /> */}

        <div className="px-4 py-4">
          <CategorySlider
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>

        <div className="px-4 space-y-4">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              quantity={getItemQuantity(item.id)}
              onAddToCart={() => handleAddToCart(item)}
              onUpdateQuantity={(quantity) =>
                handleUpdateQuantity(item.id, quantity)
              }
            />
          ))}
        </div>
      </main>

      {cart.length > 0 && (
        <div className="fixed bottom-16 left-4 right-4 z-40">
          <button
            onClick={() => navigate(`/${outletId}/${tableNo}/cart`)}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold shadow-lg flex items-center justify-between"
          >
            <span>View Cart ({cart.length} items)</span>
            <span>
              ₹
              {cart
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toFixed(2)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
