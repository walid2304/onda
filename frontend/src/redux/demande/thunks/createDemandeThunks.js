import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apidemande/axiosClient";

export const createDemande = createAsyncThunk(
  "demandes/createDemande",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("?endpoint=createD", data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
