export interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  image?: string
  description?: string
}

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