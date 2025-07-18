// redux/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage" // uses localStorage
import cartReducer from "./slices/cartSlice"
import outletReducer from "./slices/outletSlice"

const rootReducer = combineReducers({
  cart: cartReducer,
  outlet: outletReducer,
})

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "outlet"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
      serializableCheck: false, // Disable serializability check for redux-persist
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
