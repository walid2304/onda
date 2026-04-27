import { createSlice } from "@reduxjs/toolkit";
import { getStock } from "../thunks/getStockThunk";
import { addStock } from "../thunks/addStockThunk";
import { updateStock } from "../thunks/updateStockThunk";
import { deleteStock } from "../thunks/deleteStockThunk";

const initialState = {
  stocks: [],
  loading: false,
  error: null,
};

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // GET
    builder.addCase(getStock.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getStock.fulfilled, (state, action) => {
      state.loading = false;
      state.stocks = action.payload;
    });
    builder.addCase(getStock.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // ADD
    builder.addCase(addStock.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addStock.fulfilled, (state, action) => {
      state.loading = false;
      state.stocks.push(action.payload);
    });
    builder.addCase(addStock.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // UPDATE
    builder.addCase(updateStock.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateStock.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.stocks.findIndex(
        (s) => s.id_stock === action.payload.id_stock,
      );
      if (index !== -1) state.stocks[index] = action.payload;
    });
    builder.addCase(updateStock.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // DELETE
    builder.addCase(deleteStock.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteStock.fulfilled, (state, action) => {
      state.loading = false;
      state.stocks = state.stocks.filter((s) => s.id_stock !== action.payload);
    });
    builder.addCase(deleteStock.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default stockSlice.reducer;
