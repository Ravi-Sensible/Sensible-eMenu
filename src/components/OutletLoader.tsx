// components/OutletLoader.tsx
import { useEffect } from "react";
import { useParams, Outlet } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { db } from "../lib/firebase";
import { setOutlet } from "../redux/slices/outletSlice";

export default function OutletLoader() {
  const { outletId,tableNo } = useParams<{ outletId: string,tableNo: string }>();
  const dispatch = useDispatch();
  if (tableNo!=null) {
      localStorage.setItem("tableNo", tableNo);
    }
  useEffect(() => {
    if (!outletId) return;

    const fetchOutlet = async () => {
      const ref = doc(db, "OUTLET", outletId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        dispatch(setOutlet({
            id: outletId, ...snap.data(),
        }));
        const outletInfo={
            id: outletId, ...snap.data(),
        }
        console.log(outletInfo)
      } else {
        console.warn("Outlet not found:", outletId);
      }
    };

    fetchOutlet();
  }, [outletId, dispatch]);

  return <Outlet />;
}
