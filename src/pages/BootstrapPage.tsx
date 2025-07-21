import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import splashLogo from "../assets/splashLogo.png";
import type { RootState } from '../redux/store';
import { useSelector } from "react-redux";
export default function BootstrapPage() {
  // FIX: Allow state update for animation
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const tableNo = localStorage.getItem("tableNo");
  const outlet = useSelector((state: RootState) => state.outlet)
 
  useEffect(() => {
    setIsLoaded(true); // <-- add this
  }, []);

  useEffect(() => {
    if (outlet.id && tableNo) {
      const timer = setTimeout(() => {
        navigate(`/${outlet.id}/${tableNo}/menu`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [outlet.id, navigate, tableNo]); // Also include tableNo for safety

  return (
    <div className="min-h-screen bg-[#FF9171] flex items-center justify-center p-4">
      <div className="text-center">
        <div
          className={`transition-all duration-1000 ease-out ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          <div className="w-36 h-36 mx-auto mb-6 flex items-center justify-center">
            <img
              src={splashLogo}
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Sensible eMenu</h1>
          <p className="text-white/80 text-lg">
            By Sensible Connect Solution Pvt Ltd
          </p>
          <div className="mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}


// <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center p-4">
//   <div className="text-center">
//     <div
//       className={`transition-all duration-1000 ease-out ${
//         isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
//       }`}
//     >
//       <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-2xl">
//         <span className="text-6xl">🍽️</span>
//       </div>
//       <h1 className="text-4xl font-bold text-white mb-2">FoodieExpress</h1>
//       <p className="text-white/80 text-lg">Delicious food, delivered fast</p>
//       <div className="mt-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
//       </div>
//     </div>
//   </div>
// </div>
