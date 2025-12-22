//UrbanPiperForm.tsx


import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";


interface Props {
  outletId: string;
  onSuccess: () => void;
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
}


export default function UrbanPiperForm({ outletId, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<UrbanPiperFormData>({
    outletId,

    restaurant_name: "",
    restaurant_phone: "",
    restaurant_email: "",

    owners_contact_name: "",
    owners_contact_phone: "",
    owners_contact_email: "",

    country: "India",
    street_address: "",
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

    mobile_no_for_escalation: "",
    extra: "",
  });

  const update = (key: keyof UrbanPiperFormData, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    await addDoc(collection(db, "URBAN_PIPER"), {
      ...form,
      status: "submitted",
      createdAt: serverTimestamp(),
    });

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Restaurant Details</h2>

      <Input label="Restaurant Name" value={form.restaurant_name} onChange={(v:string) => update("restaurant_name", v)} />
      <Input label="Restaurant Phone" value={form.restaurant_phone} onChange={(v:string) => update("restaurant_phone", v)} />
      <Input label="Restaurant Email" value={form.restaurant_email} onChange={(v:string) => update("restaurant_email", v)} />

      <h2 className="text-xl font-semibold">Owner Details</h2>

      <Input label="Owner Name" value={form.owners_contact_name} onChange={(v:string) => update("owners_contact_name", v)} />
      <Input label="Owner Phone" value={form.owners_contact_phone} onChange={(v:string) => update("owners_contact_phone", v)} />
      <Input label="Owner Email" value={form.owners_contact_email} onChange={(v:string) => update("owners_contact_email", v)} />

      <h2 className="text-xl font-semibold">Address</h2>

      <Input label="Street Address" value={form.street_address} onChange={(v:string) => update("street_address", v)} />
      <Input label="City" value={form.city} onChange={(v:string) => update("city", v)} />
      <Input label="State" value={form.state} onChange={(v:string) => update("state", v)} />
      <Input label="Postal Code" value={form.postal_code} onChange={(v:string) => update("postal_code", v)} />

      <h2 className="text-xl font-semibold">Zomato Details</h2>

      <Input label="Zomato Ordering URL" value={form.zomato_ordering_url} onChange={(v:string) => update("zomato_ordering_url", v)} />
      <Input label="Zomato Restaurant ID" value={form.zomato_ordering_restaurant_id} onChange={(v:string) => update("zomato_ordering_restaurant_id", v)} />
      <Input label="Zomato RM Email" value={form.zomato_relationship_manager_email_id} onChange={(v:string) => update("zomato_relationship_manager_email_id", v)} />
      <Input label="Zomato RM Phone" value={form.zomato_relationship_manager_contact_number} onChange={(v:string) => update("zomato_relationship_manager_contact_number", v)} />
      <Input label="Registered Email with Zomato" value={form.merchant_registered_email_id_with_Zomato} onChange={(v:string) => update("merchant_registered_email_id_with_Zomato", v)} />

      <h2 className="text-xl font-semibold">Swiggy Details</h2>

      <Input label="Swiggy Ordering URL" value={form.swiggy_ordering_url} onChange={(v:string) => update("swiggy_ordering_url", v)} />
      <Input label="Swiggy Restaurant ID" value={form.swiggy_ordering_restaurant_id} onChange={(v:string) => update("swiggy_ordering_restaurant_id", v)} />
      <Input label="Swiggy RM Email" value={form.swiggy_relationship_manager_email_id} onChange={(v:string) => update("swiggy_relationship_manager_email_id", v)} />
      <Input label="Swiggy RM Phone" value={form.swiggy_relationship_manager_contact_number} onChange={(v:string) => update("swiggy_relationship_manager_contact_number", v)} />

      <Input label="Escalation Mobile No" value={form.mobile_no_for_escalation} onChange={(v:string) => update("mobile_no_for_escalation", v)} />
      <Textarea label="Extra Notes" value={form.extra} onChange={(v:string) => update("extra", v)} />

      <button
        disabled={loading}
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}

/* ---------- Reusable Inputs ---------- */

function Input({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
