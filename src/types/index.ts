

export interface Category {
  id: string
  name: string
  icon?: string
}




export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  image?: string
}

export interface Order {
  orderToken: string
  mobileNumber: string
  items: CartItem[]
  totalAmount: number
  paymentMethod: string
  timestamp: string
  status: string
  estimatedDelivery: string
  restaurantInfo: {
    name: string
    branch: string
    address: string
  }
}

export interface MenuItem {
  active: boolean;
  barcode: string;
  category: string;
  cess: number;
  code: number;
  costPrice: number;
  currentStock: number;
  dateTme: any; // Use `Date` if you're parsing timestamp to Date object
  discount: number;
  hsnCode: string;
  id: string;
  keyCount: number;
  kitchenId: string;
  mrpPrice: number;
  name: string;
  onlinePrice: number;
  onlineSynced: boolean;
  price: number;
  priceTable: string; // If you want to parse it, change to Record<string, number>
  recipeId: string;
  regionalName: string;
  reorderLevel: number;
  selected: boolean;
  shortName: string;
  stockable: boolean;
  taxIndex: number;
  type: number;
  unitId: number;
  weighable: boolean;
  wholeSaleAmount: number;
}

export interface OnlineOrder {
  cgst: number;
  customer_details: {
    address: string;
    address_type: string;
    city: string;
    country: string;
    customer_id: string;
    delivery_area: string;
    delivery_coordinates_type: string;
    name: string;
    order_instructions: string;
    phone_number: string;
    pincode: string;
    state: string;
  };
  dayId: string;
  delivery_charge: number;
  discount: number;
  discount_reason: string;
  enable_delivery: number;
  expected_delivery_time: string;
  external_order_id: string;
  foodready: number;
  gross_amount: number;
  gst: number;
  id: string;
  is_bill_printed: boolean;
  is_edit: boolean;
  is_kot_printed: boolean;
  is_pop_order: boolean;
  net_amount: number;
  order_date_time: string;
  order_from: string;
  order_id: number;
  order_instructions: string;
  order_items: OrderItem[];
  order_otp: string;
  order_packaging: number;
  order_taker: boolean;
  order_type: string;
  packaging: number;
  packaging_cgst: number;
  packaging_cgst_percent: number;
  packaging_sgst: number;
  packaging_sgst_percent: number;
  payment_mode: string;
  rStatus: string;
  rejection_id: number;
  rejection_msg: string;
  restaurant_address: string;
  restaurant_id: number;
  restaurant_name: string;
  restaurant_number: string;
  rider: Rider;
  sgst: number;
  showOTP: string;
  status: string;
  taxes?: any; // define structure if known
}

export interface OrderItem {
  addons: any[]; // define structure if known
  cgst: number;
  cgst_percent: number;
  discount: number;
  dish: string[];
  gst: number;
  gst_percent: number;
  instructions: string;
  item_id: string;
  item_name: string;
  item_quantity: number;
  item_unit_price: number;
  packaging: number;
  packaging_cgst: number;
  packaging_cgst_percent: number;
  packaging_gst: number;
  packaging_sgst: number;
  packaging_sgst_percent: number;
  sgst: number;
  sgst_percent: number;
  subtotal: number;
  variants: any[]; // define structure if needed
  wera_item_id: number;
}

export interface Rider {
  arrival_time: string;
  is_rider_available: boolean;
  otp: string;
  otp_message: string;
  rider_name: string;
  rider_number: string;
  rider_status: string;
  time_to_arrive: string;
}

export interface Premise {
  id: string;
  code: number;
  createdTime: string; // or use Date if you parse Firestore Timestamp
  extraPriceFlag: boolean;
  name: string;
  price: number;
  range: number;
  tables: number;
  taxIndex: number;
  type: string; // could also be `"Table"` | "..." if more types exist
  userId: string;
}


export interface Outletinfo{
  
}