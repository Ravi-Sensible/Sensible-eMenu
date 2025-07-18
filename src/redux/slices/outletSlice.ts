// redux/slices/outletSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface OutletState {
  id: string;
  name?: string;
  branch?: string;
  active?: boolean;
  renewalDate?: number;
}

const initialState: OutletState = {
  id: "",
  name: "",
  branch: "",
  active: undefined,
  renewalDate: 0,
};

const outletSlice = createSlice({
  name: "outlet",
  initialState,
  reducers: {
    setOutlet: (state, action: PayloadAction<OutletState>) => {
      return action.payload;
    },
    clearOutlet: () => initialState,
  },
});

export const { setOutlet, clearOutlet } = outletSlice.actions;
export default outletSlice.reducer;
