import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, collection, getDoc, getDocs } from "firebase/firestore";
import CategorySlider from "../components/CategorySlider";
import type { MenuItem } from "../types";
import { db } from "../lib/firebase";
import { MapPin, Search } from "lucide-react";
import type { OutletState } from "../redux/slices/outletSlice";

export default function EMenuPage() {
  const { outletId = "6QDWpN5HHvAbN7OwSyRz" } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [outletInfo, setOutletInfo] = useState<OutletState | null>(null);

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
        setOutletInfo(outletSnap.data() as OutletState);

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
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {outletInfo?.name}
              </h1>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{outletInfo?.branch}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-600 font-semibold">Open</div>
              <div className="text-xs text-gray-500">Until 11:00 PM</div>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </header>
      {/* <Header
        outlet={outletInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      /> */}

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
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  {/* {item.description && <p className="text-gray-600 text-sm mb-2">{item.description}</p>} */}
                  <p className="text-orange-600 font-bold text-lg">
                    Rs.{item.price.toFixed(2)}
                  </p>
                </div>
                {/* {item.image && (
          <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🍽️</span>
          </div>
        )} */}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
