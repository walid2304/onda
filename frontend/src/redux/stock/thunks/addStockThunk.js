import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apistock/axiosClient";

export const addStock = createAsyncThunk("stock/addStock", async (stock) => {
  const response = await axiosClient.post("?endpoint=createS", stock);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data; // <- retourne le stock complet
});
