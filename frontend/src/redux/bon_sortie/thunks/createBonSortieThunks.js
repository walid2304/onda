import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiBS/axiosClient";

export const createBonSortie = createAsyncThunk(
  "bonSortie/createBonSortie",
  async (bonSortie, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("?endpoint=createBS", bonSortie);
      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Erreur lors de la création",
        );
      }
      return response.data?.data || bonSortie;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Erreur serveur",
      );
    }
  },
);
