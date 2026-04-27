import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiBS/axiosClient";

export const updateBonSortie = createAsyncThunk(
  "bonSortie/updateBonSortie",
  async (bonSortie, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put("?endpoint=updateBS", bonSortie);
      return response.data?.success
        ? bonSortie
        : rejectWithValue(response.data.message);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Erreur serveur",
      );
    }
  },
);
