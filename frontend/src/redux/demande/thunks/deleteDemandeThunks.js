import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apidemande/axiosClient";

export const deleteDemande = createAsyncThunk(
    "demandes/deleteDemande",
    async (id_demande, { rejectWithValue }) => {
        try {
            await axiosClient.post("?endpoint=deleteD", {
                id_demande,
            });

            return id_demande;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Erreur suppression");
        }
    }
);