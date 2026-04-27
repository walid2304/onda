import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apistock/axiosClient";

export const deleteStock = createAsyncThunk(
  "stock/deleteStock",
  async (id_stock) => {
    const response = await axiosClient.delete("?endpoint=deleteS", {
      data: { id_stock },
    });
    if (!response.data.success) throw new Error(response.data.message);
    return id_stock;
  },
);
