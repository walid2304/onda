import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiBS/axiosClient";

export const getBonSorties = createAsyncThunk(
    "bonSortie/getBonSorties",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get("?endpoint=readBS");
            // Assure-toi que c'est bien un tableau
            return Array.isArray(response.data) ? response.data : response.data.data || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || "Erreur serveur");
        }
    }
);