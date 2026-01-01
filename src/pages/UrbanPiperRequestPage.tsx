import { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";
import splashLogo from "../assets/splashLogo3.png";
// Types
interface Outlet {
  id: string;
  name: string;
  branch?: string;
  mobile?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
}

interface UserProfile {
  id: string;
  mobile: string;
  outlets: string[];
}

interface UrbanPiperFormData {
  outletId: string;
  restaurant_name: string;
  restaurant_phone: string;
  restaurant_email: string;
  owners_contact_name: string;
  owners_contact_phone: string;
  owners_contact_email: string;
  country: string;
  street_address: string;
  city: string;
  postal_code: string;
  state: string;
  zomato_ordering_url: string;
  zomato_ordering_restaurant_id: string;
  zomato_relationship_manager_email_id: string;
  zomato_relationship_manager_contact_number: string;
  merchant_registered_email_id_with_Zomato: string;
  swiggy_ordering_url: string;
  swiggy_ordering_restaurant_id: string;
  swiggy_relationship_manager_email_id: string;
  swiggy_relationship_manager_contact_number: string;
  mobile_no_for_escalation: string;
  extra: string;
  source?: string;
}

export default function UrbanPiperRequestPage() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"search" | "outlets" | "form" | "success">("search");
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);

  // Search Handler
  const handleSearch = async () => {
    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");

    try {
    //   const variants = [`+91${mobile}`,mobile, ];
      const variants =`+91${mobile}`;

      // Check USER_PROFILE
      const userQuery = query(
        collection(db, "USER_PROFILE"),
        where("mobile", "==", variants)
      );
      const userSnap = await getDocs(userQuery);

      if (userSnap.empty) {
        setError("You are not our existing customer. Please contact our support team.");
        setLoading(false);
        return;
      }

      const userDoc = userSnap.docs[0];
      const userData = {
        id: userDoc.id,
        ...(userDoc.data() as any),
      } as UserProfile;

      setUser(userData);
      // Load Outlets
      const outletList: Outlet[] = [];
      for (const outletId of userData?.outlets || []) {
        const outletSnap = await getDoc(doc(db, "OUTLET", outletId));
        if (outletSnap.exists()) {
          outletList.push({
            id: outletId,
            ...(outletSnap.data() as any),
          });
        }
      }

      if (outletList.length === 0) {
        setError("No outlets found for this account.");
        setLoading(false);
        return;
      }

      setOutlets(outletList);
      setStep("outlets");
    } catch (err) {
      console.error("Search error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Select Outlet
 const handleSelectOutlet = async (outlet: Outlet) => {
  setLoading(true);
  setError("");

  try {
    const existingQuery = query(
      collection(db, "URBAN_PIPER"),
      where("outletId", "==", outlet.id)
    );

    const existingSnap = await getDocs(existingQuery);

    if (!existingSnap.empty) {
      // Take first matching document
      const docData = existingSnap.docs[0].data();

      // ✅ Check source condition
      if (docData?.source === "OFFER") {
        setStep("success");
        return;
      }
    }

    // ✅ Either no doc OR source missing OR source not OFFER
    setSelectedOutlet(outlet);
    setStep("form");

  } catch (err) {
    console.error("Outlet selection error:", err);
    setError("An error occurred. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const handleFormSuccess = () => {
    setStep("success");
  };

  const handleReset = () => {
    setMobile("");
    setError("");
    setStep("search");
    setUser(null);
    setOutlets([]);
    setSelectedOutlet(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center">
          <img 
            src={splashLogo} 
            alt="Company Logo" 
            className="h-32 mx-auto mb-4"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h1 className="text-3xl font-bold text-white mb-2">
           Festive Loyalty Rewards Program
          </h1>
          <p className="text-blue-100">
          As a special benefit, the first 75 existing customers to register will receive FREE Swiggy & Zomato integration with their existing Sensible Billing Machine.
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === "search" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Let's Get Started
                </h2>
                <p className="text-gray-600">
                  Enter your registered mobile number to continue
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="flex flex-col gap-3">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => {
                          setMobile(e.target.value.replace(/\D/g, '').slice(0, 10));
                          setError("");
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSearch();
                        }}
                        placeholder="Enter 10-digit number"
                        className="w-full border-2 border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      disabled={loading || mobile.length !== 10}
                      className="w-[50%] bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                    >
                      {loading ? "Checking..." : "Continue"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === "outlets" && (
            <div className="space-y-6">
              <div>
                <button
                  onClick={handleReset}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 flex items-center gap-2"
                >
                  ← Back
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Select Your Outlet
                </h2>
                <p className="text-gray-600">
                  Choose the outlet you want to integrate
                </p>
              </div>

              <div className="space-y-3">
                {outlets.map((outlet) => (
                  <button
                    key={outlet.id}
                    onClick={() => handleSelectOutlet(outlet)}
                    disabled={loading}
                    className="w-full border-2 border-gray-200 rounded-xl p-5 text-left hover:border-blue-500 hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <p className="font-semibold text-lg text-gray-800">{outlet.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{outlet?.branch}</p>
                  </button>
                ))}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          )}

          {step === "form" && selectedOutlet && (
            <UrbanPiperForm
              outlet={selectedOutlet}
              userMobile={user?.mobile || mobile}
              onSuccess={handleFormSuccess}
              onBack={() => setStep("outlets")}
            />
          )}

         {step === "success" && (
            <div className="py-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Request Submitted Successfully!
                </h2>
                <p className="text-gray-600">
                  Your request has been submitted. Our team will contact you shortly.
                </p>
              </div>

              {/* Progress Steps */}
              <div className="space-y-4 mb-8">
                <StepItem 
                  number={1} 
                  title="Onboarding Form Submitted" 
                  description="Thank You For Register"
                  completed={true}
                />
                <StepItem 
                  number={2} 
                  title="Account Verification" 
                  description="We'll verify your restaurant details"
                  completed={false}
                />
                <StepItem 
                  number={3} 
                  title="Platform Setup" 
                  description="Setting up Swiggy & Zomato integration"
                  completed={false}
                />
                <StepItem 
                  number={4} 
                  title="Menu Configuration" 
                  description="Configuring your menu across platforms"
                  completed={false}
                />
                <StepItem 
                  number={5} 
                  title="Go Live" 
                  description="Your restaurant will be live on both platforms"
                  completed={false}
                />
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 font-medium transition"
              >
                Submit Another Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function StepItem({ 
  number, 
  title, 
  description, 
  completed 
}: { 
  number: number; 
  title: string; 
  description: string; 
  completed: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
        completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
      }`}>
        {completed ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          number
        )}
      </div>
      <div className="flex-1 pt-1">
        <h3 className={`font-semibold ${completed ? 'text-gray-800' : 'text-gray-400'}`}>
          {title}
        </h3>
        <p className={`text-sm mt-0.5 ${completed ? 'text-gray-600' : 'text-gray-400'}`}>
          {description}
        </p>
      </div>
    </div>
  );
}

// Form Component
function UrbanPiperForm({ 
  outlet, 
  userMobile,
  onSuccess, 
  onBack 
}: { 
  outlet: Outlet; 
  userMobile: string;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<UrbanPiperFormData>({
    outletId: outlet.id,
    restaurant_name: outlet.name || "",
    restaurant_phone: outlet.mobile || userMobile || "",
    restaurant_email: "",
    owners_contact_name: outlet.ownerName || "",
    owners_contact_phone: outlet.ownerPhone || userMobile || "",
    owners_contact_email: outlet.ownerEmail || "",
    country: "India",
    street_address: outlet?.branch || "",
    city: "",
    postal_code: "",
    state: "",
    zomato_ordering_url: "",
    zomato_ordering_restaurant_id: "",
    zomato_relationship_manager_email_id: "",
    zomato_relationship_manager_contact_number: "",
    merchant_registered_email_id_with_Zomato: "",
    swiggy_ordering_url: "",
    swiggy_ordering_restaurant_id: "",
    swiggy_relationship_manager_email_id: "",
    swiggy_relationship_manager_contact_number: "",
    mobile_no_for_escalation: userMobile || "",
    extra: "",
    source:"OFFER"
  });

  const update = (key: keyof UrbanPiperFormData, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!form.restaurant_name.trim()) {
      setError("Restaurant name is required");
      return false;
    }
    if (!form.restaurant_phone.trim()) {
      setError("Restaurant phone is required");
      return false;
    }
    if (!form.owners_contact_name.trim()) {
      setError("Owner name is required");
      return false;
    }
    if (!form.owners_contact_phone.trim()) {
      setError("Owner phone is required");
      return false;
    }
    if (!form.street_address.trim()) {
      setError("Street address is required");
      return false;
    }
    if (!form.city.trim()) {
      setError("City is required");
      return false;
    }
    if (!form.state.trim()) {
      setError("State is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Save with outletId as document ID
      await setDoc(doc(db, "URBAN_PIPER", outlet.id), {
        ...form,
        status: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      onSuccess();
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to submit. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex items-center justify-between sticky top-0 bg-white py-2 border-b">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
        >
          ← Back
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Complete Details</h2>
        <div className="w-12"></div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Section title="Restaurant Details">
        <Input 
          label="Restaurant Name*" 
          value={form.restaurant_name} 
          onChange={(v) => update("restaurant_name", v)} 
          required
        />
        <Input 
          label="Restaurant Phone*" 
          value={form.restaurant_phone} 
          onChange={(v) => update("restaurant_phone", v)} 
          type="tel"
          required
        />
        <Input 
          label="Restaurant Email" 
          value={form.restaurant_email} 
          onChange={(v) => update("restaurant_email", v)} 
          type="email"
        />
      </Section>

      <Section title="Owner Details">
        <Input 
          label="Owner Name*" 
          value={form.owners_contact_name} 
          onChange={(v) => update("owners_contact_name", v)} 
          required
        />
        <Input 
          label="Owner Phone*" 
          value={form.owners_contact_phone} 
          onChange={(v) => update("owners_contact_phone", v)} 
          type="tel"
          required
        />
        <Input 
          label="Owner Email" 
          value={form.owners_contact_email} 
          onChange={(v) => update("owners_contact_email", v)} 
          type="email"
        />
      </Section>

      <Section title="Address">
        <Input 
          label="Street Address*" 
          value={form.street_address} 
          onChange={(v) => update("street_address", v)} 
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="City*" 
            value={form.city} 
            onChange={(v) => update("city", v)} 
            required
          />
          <Input 
            label="State*" 
            value={form.state} 
            onChange={(v) => update("state", v)} 
            required
          />
        </div>
        <Input 
          label="Postal Code" 
          value={form.postal_code} 
          onChange={(v) => update("postal_code", v)} 
        />
      </Section>

      <Section title="Zomato Details">
        <Input 
          label="Zomato Ordering URL" 
          value={form.zomato_ordering_url} 
          onChange={(v) => update("zomato_ordering_url", v)} 
          placeholder="https://www.zomato.com/..."
        />
        <Input 
          label="Zomato Restaurant ID" 
          value={form.zomato_ordering_restaurant_id} 
          onChange={(v) => update("zomato_ordering_restaurant_id", v)} 
        />
        <Input 
          label="Zomato RM Email" 
          value={form.zomato_relationship_manager_email_id} 
          onChange={(v) => update("zomato_relationship_manager_email_id", v)} 
          type="email"
        />
        <Input 
          label="Zomato RM Phone" 
          value={form.zomato_relationship_manager_contact_number} 
          onChange={(v) => update("zomato_relationship_manager_contact_number", v)} 
          type="tel"
        />
        <Input 
          label="Registered Email with Zomato" 
          value={form.merchant_registered_email_id_with_Zomato} 
          onChange={(v) => update("merchant_registered_email_id_with_Zomato", v)} 
          type="email"
        />
      </Section>

      <Section title="Swiggy Details">
        <Input 
          label="Swiggy Ordering URL" 
          value={form.swiggy_ordering_url} 
          onChange={(v) => update("swiggy_ordering_url", v)} 
          placeholder="https://www.swiggy.com/..."
        />
        <Input 
          label="Swiggy Restaurant ID" 
          value={form.swiggy_ordering_restaurant_id} 
          onChange={(v) => update("swiggy_ordering_restaurant_id", v)} 
        />
        <Input 
          label="Swiggy RM Email" 
          value={form.swiggy_relationship_manager_email_id} 
          onChange={(v) => update("swiggy_relationship_manager_email_id", v)} 
          type="email"
        />
        <Input 
          label="Swiggy RM Phone" 
          value={form.swiggy_relationship_manager_contact_number} 
          onChange={(v) => update("swiggy_relationship_manager_contact_number", v)} 
          type="tel"
        />
      </Section>

      <Section title="Additional Information">
        <Input 
          label="Escalation Mobile Number" 
          value={form.mobile_no_for_escalation} 
          onChange={(v) => update("mobile_no_for_escalation", v)} 
          type="tel"
        />
        <Textarea 
          label="Extra Notes" 
          value={form.extra} 
          onChange={(v) => update("extra", v)} 
          placeholder="Any additional information you'd like to share..."
        />
      </Section>

      <button
        disabled={loading}
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg transition"
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </div>
  );
}

// Reusable Components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Input({ 
  label, 
  value, 
  onChange, 
  type = "text",
  placeholder = "",
  required = false
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      />
    </div>
  );
}

function Textarea({ 
  label, 
  value, 
  onChange,
  placeholder = ""
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
      />
    </div>
  );
}