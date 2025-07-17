import type { Category, MenuItem } from "../types"


export const categories: Category[] = [
  { id: "pizza", name: "Pizza", icon: "🍕" },
  { id: "burgers", name: "Burgers", icon: "🍔" },
  { id: "drinks", name: "Drinks", icon: "🥤" },
  { id: "desserts", name: "Desserts", icon: "🍰" },
  { id: "salads", name: "Salads", icon: "🥗" },
]

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Margherita Pizza",
    price: 12.99,
    category: "pizza",
    description: "Fresh tomatoes, mozzarella cheese, and basil leaves",
  },
  {
    id: "2",
    name: "Pepperoni Pizza",
    price: 15.99,
    category: "pizza",
    description: "Spicy pepperoni with mozzarella cheese",
  },
  {
    id: "3",
    name: "BBQ Chicken Pizza",
    price: 17.99,
    category: "pizza",
    description: "Grilled chicken with BBQ sauce and red onions",
  },
  {
    id: "4",
    name: "Classic Burger",
    price: 8.99,
    category: "burgers",
    description: "Beef patty with lettuce, tomato, and pickles",
  },
  {
    id: "5",
    name: "Cheese Burger",
    price: 9.99,
    category: "burgers",
    description: "Classic burger with melted cheddar cheese",
  },
  {
    id: "6",
    name: "Bacon Deluxe",
    price: 12.99,
    category: "burgers",
    description: "Double beef patty with crispy bacon and cheese",
  },
  {
    id: "7",
    name: "Chicken Burger",
    price: 10.99,
    category: "burgers",
    description: "Grilled chicken breast with mayo and lettuce",
  },
  {
    id: "8",
    name: "Coca Cola",
    price: 2.99,
    category: "drinks",
    description: "Classic refreshing cola drink",
  },
  {
    id: "9",
    name: "Orange Juice",
    price: 3.99,
    category: "drinks",
    description: "Fresh squeezed orange juice",
  },
  {
    id: "10",
    name: "Iced Coffee",
    price: 4.99,
    category: "drinks",
    description: "Cold brew coffee with ice and milk",
  },
  {
    id: "11",
    name: "Chocolate Cake",
    price: 6.99,
    category: "desserts",
    description: "Rich chocolate cake with chocolate frosting",
  },
  {
    id: "12",
    name: "Cheesecake",
    price: 7.99,
    category: "desserts",
    description: "Creamy New York style cheesecake",
  },
  {
    id: "13",
    name: "Ice Cream Sundae",
    price: 5.99,
    category: "desserts",
    description: "Vanilla ice cream with chocolate sauce and nuts",
  },
  {
    id: "14",
    name: "Caesar Salad",
    price: 8.99,
    category: "salads",
    description: "Romaine lettuce with Caesar dressing and croutons",
  },
  {
    id: "15",
    name: "Greek Salad",
    price: 9.99,
    category: "salads",
    description: "Mixed greens with feta cheese and olives",
  },
  {
    id: "16",
    name: "Chicken Salad",
    price: 11.99,
    category: "salads",
    description: "Grilled chicken breast over mixed greens",
  },
]

export const banners = [
  {
    id: 1,
    title: "🍕 50% Off on Pizza",
    subtitle: "Limited time offer - Order now!",
  },
  {
    id: 2,
    title: "🚚 Free Delivery",
    subtitle: "On orders above $25",
  },
  {
    id: 3,
    title: "🍔 New Burger Menu",
    subtitle: "Try our latest creations",
  },
  {
    id: 4,
    title: "🥤 Buy 2 Get 1 Free",
    subtitle: "On all beverages",
  },
  {
    id: 5,
    title: "🍰 Sweet Deals",
    subtitle: "20% off on all desserts",
  },
]