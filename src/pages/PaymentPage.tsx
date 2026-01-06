import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  // CreditCard,
  // Smartphone,
  Banknote,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { v4 as uuidv4 } from "uuid"; // for generating order IDs
import dayjs from "dayjs"; // optional, for formatting
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
  // getDocs,
  // limit,
  // query,
  // updateDoc,
  // where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { clearCart } from "../redux/slices/cartSlice";
import type { Premise } from "../types";

type Table = {
  tableNo: string;
  premise: string;
  premiseType: string;
  groupID: number;
};

const paymentMethods = [
  {
    id: "cash",
    name: "Pay At Counter",
    icon: Banknote,
    description: "Pay when you will get order at counter",
  },
  // {
  //   id: "card",
  //   name: "Credit/Debit Card",
  //   icon: CreditCard,
  //   description: "Secure card payment",
  // },
  // {
  //   id: "upi",
  //   name: "UPI Payment",
  //   icon: Smartphone,
  //   description: "Pay using UPI apps",
  // },
];

export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const cart = useSelector((state: RootState) => state.cart.items);
  const outlet = useSelector((state: RootState) => state.outlet);
  const [loading, setLoading] = useState(false);
  const [tableList, ] = useState<Table[]>([]);
  // const tableList: Table[] = [];
  const tableNo = localStorage.getItem("tableNo");
  // const outletId = outlet?.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const fetchPrimse = async () => {
    const premiseSnap = await getDocs(
      collection(db, "OUTLET", outlet.id, "PREMISES")
    );

    const premiseList: Premise[] = premiseSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Premise[];

    let groupIdCounter = 0;

    premiseList.forEach((premise) => {
      let rangeStart = premise.range;

      if (!rangeStart || rangeStart <= 0) {
        rangeStart = groupIdCounter;
      }

      let noOfTables = premise.tables;

      if ((!noOfTables || noOfTables <= 0) && premise.id !== "default") {
        noOfTables = 10;
      }

      for (let i = 0; i < noOfTables; i++) {
        groupIdCounter++;

        tableList.push({
          tableNo: String(rangeStart + i),
          premise: premise.name,
          premiseType: premise.type,
          groupID: groupIdCounter, // 🔥 SAME AS JAVA
        });
       
      }
    });
  };
  useEffect(() => {
    fetchPrimse();
  }, []);
  // swiggy zomao collection
  //  const handlePlaceOrder = () => {
  //   if (!selectedMethod) return

  //   localStorage.setItem("selectedPaymentMethod", selectedMethod)
  //   navigate("/order-success")
  // }

  //   const handlePlaceOrder = async () => {
  //     if (!selectedMethod) return;
  //     setLoading(true);
  //     const mobile = localStorage.getItem("customerMobile");
  //     if (!mobile || cart.length === 0 || !outlet.id) return;
  // function generateUniqueNumber(digits = 10) {
  //   const min = Math.pow(10, digits - 1);
  //   const max = Math.pow(10, digits) - 1;
  //   return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
  // }

  // const externalOrderId = generateUniqueNumber(); // Example: "7834562190"
  //     const orderId = uuidv4(); // or your own logic
  //     const orderDateTime = Date.now().toString();

  //     const orderItems = cart.map((item) => ({
  //       addons: [],
  //       cgst: 0,
  //       cgst_percent: 0,
  //       discount: 0,
  //       dish: [],
  //       gst: 0,
  //       gst_percent: 0,
  //       instructions: "",
  //       item_id: item.id,
  //       item_name: item.name,
  //       item_quantity: item.quantity,
  //       item_unit_price: item.price,
  //       packaging: 0,
  //       packaging_cgst: 0,
  //       packaging_cgst_percent: 0,
  //       packaging_gst: 0,
  //       packaging_sgst: 0,
  //       packaging_sgst_percent: 0,
  //       sgst: 0,
  //       sgst_percent: 0,
  //       subtotal: item.quantity * item.price,
  //       variants: [],
  //       wera_item_id: 0,
  //     }));

  //     const orderPayload = {
  //       cgst: 0,
  //       customer_details: {
  //         address: tableNo?.toUpperCase() || "",
  //         address_type: "",
  //         city: "",
  //         country: "India",
  //         customer_id: "",
  //         delivery_area: "",
  //         delivery_coordinates_type: "",
  //         name: "",
  //         order_instructions: "",
  //         phone_number: mobile,
  //         pincode: "",
  //         state: "",
  //       },
  //       dayId: dayjs().format("YYYY-MM-DD"),
  //       delivery_charge: 0,
  //       discount: 0,
  //       discount_reason: "",
  //       enable_delivery: 0,
  //       expected_delivery_time: "",
  //       external_order_id:externalOrderId,
  //       foodready: 0,
  //       gross_amount: cart.reduce(
  //         (sum, item) => sum + item.price * item.quantity,
  //         0
  //       ),
  //       gst: 0,
  //       id: orderId,
  //       is_bill_printed: false,
  //       is_edit: false,
  //       is_kot_printed: false,
  //       is_pop_order: false,
  //       net_amount: cart.reduce(
  //         (sum, item) => sum + item.price * item.quantity,
  //         0
  //       ),
  //       order_date_time: orderDateTime,
  //       order_from: "WEB_APP",
  //       order_id: Math.floor(Math.random() * 1000000), // or use timestamp
  //       order_instructions: "",
  //       order_items: orderItems,
  //       order_otp: "",
  //       order_packaging: 0,
  //       order_taker: false,
  //       order_type: "ONLINE",
  //       packaging: 0,
  //       packaging_cgst: 0,
  //       packaging_cgst_percent: 0,
  //       packaging_sgst: 0,
  //       packaging_sgst_percent: 0,
  //       payment_mode: selectedMethod,
  //       rStatus: "PENDING",
  //       rejection_id: 0,
  //       rejection_msg: "",
  //       restaurant_address: "",
  //       restaurant_id: 0,
  //       restaurant_name: outlet.name,
  //       restaurant_number: "",
  //       rider: {
  //         arrival_time: "",
  //         is_rider_available: false,
  //         otp: "",
  //         otp_message: "",
  //         rider_name: "",
  //         rider_number: "",
  //         rider_status: "pending",
  //         time_to_arrive: "",
  //       },
  //       sgst: 0,
  //       showOTP: "",
  //       status: "pending",
  //       taxes: [],
  //     };

  //     try {
  //       const outletRef = doc(db, "OUTLET", outlet.id);
  //       await addDoc(collection(outletRef, "ONLINE_ORDERS"), orderPayload);
  //       dispatch(clearCart())
  //       setLoading(false);
  //       localStorage.setItem("selectedPaymentMethod", selectedMethod);
  //       navigate(`/${outlet.id}/${tableNo}/order-success`);
  //       // navigate("/order-success")
  //     } catch (error) {
  //       setLoading(false);
  //       console.error("Failed to place order:", error);
  //       alert("Failed to place order. Please try again.");
  //     }
  //   };
  //working Code Bewlo

  const handleSaveCaptainOrder = async () => {
    setLoading(true);

    // Remove 'table' prefix if your tableNo format is 'table6'
    let tableNumberOnly = tableNo;

    if (tableNo) {
      tableNumberOnly = tableNo.replace(/^(room|table)/i, "");
    }

    const selectedTable = tableList.find((t) => t.tableNo === tableNumberOnly);

    let premise = selectedTable?.premise;
    let premiseType = selectedTable?.premiseType;


    // alert(selectedTable?.groupID)
    if (!selectedTable) {
      alert("Invalid table selected");
      return;
    }

    const groupID = selectedTable.groupID;

    const now = Date.now();
    const billId = now;
    // const groupID = tableNumberOnly; // set as per business logic
    const captainTabId = Date.now().toString();
    const serailNo = uuidv4().replace(/-/g, "").slice(0, 16); // Example serial number, unique
    const userId = "bev6xlEqb8ZkaHs44S3KTRORDXu1"; // or your session/user data

    // (1) Build billItems, kotList, etc. as shown in previous answer
    const billItems = cart.map((item, idx) => ({
      bags: 1.0,
      barcode: "0",
      billId,
      canWeight: false,
      categoryId: item.category || "",
      cess: 0.0,
      code: 2,
      createdDate: 0,
      discountAmount: 0.0,
      discountPercent: 0.0,
      duration: 0.0,
      hsnCode: "0",
      id: billId + idx + 1,
      isKOTDone: true,
      isOutOfStock: false,
      kitchenId: "LiFtRL8L9ywkQ0xvE1yt",
      mrpPrice: 0.0,
      name: item.name,
      percentage: 0.0,
      price: item.price,
      productId: item.id,
      quantity: item.quantity,
      regionalName: item.regionalName || "",
      roomsDays: 0.0,
      roomsFlag: false,
      selected: true,
      state: 0,
      stockable: false,
      taxIndex: 2,
      total: item.price * item.quantity,
      unitId: 0,
      updatedDate: 0,
      viewType: 0,
      weightValue: 0.0,
    }));

    const kotList = [
      {
        dateTime: dayjs().format("MMM DD, YYYY h:mm:ss A"),
        id: 1,
        items: cart.map((item, idx) => ({
          id: idx + 1,
          itemName: item.name,
          kotId: 1,
          productId: item?.id,
          quantity: item.quantity,
          state: 0,
        })),
        kitchenId: Date.now().toString(),
        serialNo: String(billId),
        state: 0,
        table: tableNo,
        userId: 0,
      },
    ];

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const taxAmount = Math.round(total * 0.05 * 10) / 10;
    const finalTotal = total + taxAmount;

    const tableDetailsObj = {
      balance: finalTotal,
      billItems,
      billPrintCount: 0,
      billType: premise,
      captainTabId, // same as id
      cashTenderAmt: 0.0,
      cessAmount: 0.0,
      changeAmt: 0.0,
      checkInTime: billId,
      checkOutTime: 0,
      // kitchenId:Date.now().toString(),
      createdDate: billId,
      customerBillAdvance: 0.0,
      customerId: "",
      days: 0,
      discount: 0.0,
      discountPercent: 0.0,
      duration: 0.0,
      estimate: false,
      finalTotal: finalTotal,
      gstFlag: false,
      id: billId,
      isKOTDone: true,
      isSelected: true,
      kotList,
      noOfPerson: 0,
      parcelCharges: 0.0,
      paymentMode: 0,
      percentage: 0.0,
      roundOff: Math.round((finalTotal - Math.floor(finalTotal)) * 100) / 100,
      serviceChargeAmount: 0.0,
      serviceChargePercent: 0.0,
      settled: false,
      state: 1,
      table: JSON.stringify([
        {
          table_no: tableNumberOnly?.toString(),
          premise: premise,
          premise_type: premiseType,
          view_type: 0,
          group_id: groupID,
          booked: true,
          settled: false,
        },
      ]),
      taxAmount: taxAmount,
      taxState: 0,
      total: total,
      updatedDate: 0,
      userId,
      viewType: 2,
    };

    // (2) Build the Firestore document
    const captainOrderDoc = {
      flag: "input",
      groupID: Number(groupID), // number
      id: "", // string
      serailNo, // string
      tableDetails: JSON.stringify(tableDetailsObj), // Save as string
    };

    // (3) Save to Firestore "CAPTAIN_ORDER" subcollection
    try {
      const outletRef = doc(db, "OUTLET", outlet.id);
      const captainOrderRef = collection(outletRef, "CAPTAIN_ORDER");

      // 🔍 Check if same groupID order already exists & pending
      const q = query(
        captainOrderRef,
        where("groupID", "==", Number(groupID)),
        where("flag", "==", "input") // pending order
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        setLoading(false);
        alert("Previous order is still pending for this group.");
        return; // ⛔ stop execution
      }

      await addDoc(captainOrderRef, captainOrderDoc);

      dispatch(clearCart());
      setLoading(false);
      navigate(`/${outlet.id}/${tableNo}/order-success`);
    } catch (error) {
      setLoading(false);
      console.error("Failed to place Captain Order:", error);
      alert("Failed to place Captain Order. Please try again.");
    }
    // try {
    //   const outletRef = doc(db, "OUTLET", outlet.id);
    //   await addDoc(collection(outletRef, "CAPTAIN_ORDER"), captainOrderDoc);
    //   dispatch(clearCart());
    //   setLoading(false);
    //   navigate(`/${outlet.id}/${tableNo}/order-success`);
    //   // Optionally, clear cart, redirect, etc
    // } catch (error) {
    //   setLoading(false);
    //   console.error("Failed to place Captain Order:", error);
    //   alert("Failed to place Captain Order. Please try again.");
    // }
  };

  // const handleSaveCaptainOrder = async () => {
  //   setLoading(true);
  //   try {
  //     // Step 1: Fetch premise info
  //     const prodRef = query(collection(db, "OUTLET", outletId, "PREMISES"), limit(1));
  //     const prodSnap = await getDocs(prodRef);
  //     const firstItem = !prodSnap.empty
  //       ? { id: prodSnap.docs[0].id, ...prodSnap.docs[0].data() } as Premise
  //       : null;

  //     const premise = firstItem?.name;
  //     const premiseType = firstItem?.type;
  //     let tableNumberOnly = tableNo?.replace(/^table/i, "") || "";
  //     const groupID = tableNumberOnly;
  //     const now = Date.now();
  //     const billId = now;

  //     const captainTabId = "4zqeYYHPoEpQ6CADLgsI";
  //     const serailNo = uuidv4().replace(/-/g, "").slice(0, 16);
  //     const userId = "bev6xlEqb8ZkaHs44S3KTRORDXu1";

  //     // Step 2: Build billItems and kotList
  //     const billItems = cart.map((item, idx) => ({
  //       // ...same as before
  //       bags: 1.0,
  //       barcode: "0",
  //       billId,
  //       canWeight: false,
  //       categoryId: item.category || "",
  //       cess: 0.0,
  //       code: 2,
  //       createdDate: 0,
  //       discountAmount: 0.0,
  //       discountPercent: 0.0,
  //       duration: 0.0,
  //       hsnCode: "0",
  //       id: billId + idx + 1,
  //       isKOTDone: true,
  //       isOutOfStock: false,
  //       kitchenId: "LiFtRL8L9ywkQ0xvE1yt",
  //       mrpPrice: 0.0,
  //       name: item.name,
  //       percentage: 0.0,
  //       price: item.price,
  //       productId: item.id,
  //       quantity: item.quantity,
  //       regionalName: item.regionalName || "",
  //       roomsDays: 0.0,
  //       roomsFlag: false,
  //       selected: true,
  //       state: 0,
  //       stockable: false,
  //       taxIndex: 2,
  //       total: item.price * item.quantity,
  //       unitId: 0,
  //       updatedDate: 0,
  //       viewType: 0,
  //       weightValue: 0.0,
  //     }));

  //     const kotList = [
  //       {
  //         dateTime: dayjs().format("MMM DD, YYYY h:mm:ss A"),
  //         id: 1,
  //         items: cart.map((item, idx) => ({
  //           id: idx + 1,
  //           itemName: item.name,
  //           kotId: 1,
  //           productId: item?.id,
  //           quantity: item.quantity,
  //           state: 0,
  //         })),
  //         kitchenId: "LiFtRL8L9ywkQ0xvE1yt",
  //         serialNo: String(billId),
  //         state: 0,
  //         table: tableNo,
  //         userId: 0,
  //       },
  //     ];

  //     const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  //     const taxAmount = Math.round(total * 0.05 * 10) / 10;
  //     const finalTotal = total + taxAmount;

  //     const newTableDetailsObj = {
  //       // Same as before...
  //       balance: finalTotal,
  //       billItems,
  //       billPrintCount: 0,
  //       billType: premise,
  //       captainTabId,
  //       cashTenderAmt: 0.0,
  //       cessAmount: 0.0,
  //       changeAmt: 0.0,
  //       checkInTime: billId,
  //       checkOutTime: 0,
  //       createdDate: billId,
  //       customerBillAdvance: 0.0,
  //       customerId: "",
  //       days: 0,
  //       discount: 0.0,
  //       discountPercent: 0.0,
  //       duration: 0.0,
  //       estimate: false,
  //       finalTotal,
  //       gstFlag: false,
  //       id: billId,
  //       isKOTDone: true,
  //       isSelected: true,
  //       kotList,
  //       noOfPerson: 0,
  //       parcelCharges: 0.0,
  //       paymentMode: 0,
  //       percentage: 0.0,
  //       roundOff: Math.round((finalTotal - Math.floor(finalTotal)) * 100) / 100,
  //       serviceChargeAmount: 0.0,
  //       serviceChargePercent: 0.0,
  //       settled: false,
  //       state: 1,
  //       table: JSON.stringify([
  //         {
  //           table_no: tableNumberOnly,
  //           premise,
  //           premise_type: premiseType,
  //           view_type: 0,
  //           group_id: tableNumberOnly,
  //           booked: true,
  //           settled: false,
  //         },
  //       ]),
  //       taxAmount,
  //       taxState: 0,
  //       total,
  //       updatedDate: 0,
  //       userId,
  //       viewType: 2,
  //     };

  //     const outletRef = doc(db, "OUTLET", outlet.id);
  //     const captainOrderQuery = query(
  //       collection(outletRef, "CAPTAIN_ORDER"),
  //       where("groupID", "==", Number(groupID))
  //     );

  //     const existingDocsSnap = await getDocs(captainOrderQuery);

  //     if (!existingDocsSnap.empty) {
  //       // Existing doc found → update
  //       const docToUpdate = existingDocsSnap.docs[0];
  //       const data = docToUpdate.data();
  //       const existingDetails = JSON.parse(data.tableDetails || "{}");

  //       // Merge billItems
  //       const updatedBillItems = [...(existingDetails.billItems || []), ...billItems];

  //       // Merge total
  //       const updatedTotal = updatedBillItems.reduce(
  //         (sum, item) => sum + item.price * item.quantity,
  //         0
  //       );
  //       const updatedTaxAmount = Math.round(updatedTotal * 0.05 * 10) / 10;
  //       const updatedFinalTotal = updatedTotal + updatedTaxAmount;

  //       existingDetails.billItems = updatedBillItems;
  //       existingDetails.total = updatedTotal;
  //       existingDetails.finalTotal = updatedFinalTotal;
  //       existingDetails.taxAmount = updatedTaxAmount;

  //       await updateDoc(docToUpdate.ref, {
  //         flag: "update", // ✅ Ensure the flag is updated
  //         tableDetails: JSON.stringify(existingDetails),
  //       });

  //     } else {
  //       // No existing doc → add new
  //       const newCaptainOrderDoc = {
  //         flag: "input",
  //         groupID: Number(groupID),
  //         id: captainTabId,
  //         serailNo,
  //         tableDetails: JSON.stringify(newTableDetailsObj),
  //       };

  //       await addDoc(collection(outletRef, "CAPTAIN_ORDER"), newCaptainOrderDoc);
  //     }

  //     dispatch(clearCart());
  //     navigate(`/${outlet.id}/${tableNo}/order-success`);
  //   } catch (error) {
  //     console.error("Failed to place Captain Order:", error);
  //     alert("Failed to place Captain Order. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
          // onClick={handlePlaceOrder}
          onClick={handleSaveCaptainOrder}
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
