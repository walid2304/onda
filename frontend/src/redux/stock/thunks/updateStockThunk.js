import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apistock/axiosClient";

export const updateStock = createAsyncThunk(
  "stock/updateStock",
  async (stock) => {
    const response = await axiosClient.put("?endpoint=updateS", stock);

    if (!response.data.success) throw new Error(response.data.message);

    return response.data.data;
  },
);
