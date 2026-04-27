import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apidemande/axiosClient";

export const updateDemande = createAsyncThunk(
  "demandes/updateDemande",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put("?endpoint=updateD", data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
