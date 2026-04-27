import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiBS/axiosClient";

export const deleteBonSortie = createAsyncThunk(
  "bonSortie/deleteBonSortie",
  async (id_bs, { rejectWithValue }) => {
    try {
      const response = await axiosClient.delete("?endpoint=deleteBS", {
        data: { id_bs },
      });
      return response.data?.success
        ? id_bs
        : rejectWithValue(response.data.message);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Erreur serveur",
      );
    }
  },
);
