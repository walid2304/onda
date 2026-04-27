import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiaffectation/axiosClient";
export const updateAffectation = createAsyncThunk(
    "affectations/updateAffectation",
    async (affectation) => {
        // Ici, tu dois t'assurer que id_affe existe
        if (!affectation.id_affe) throw new Error("ID affectation manquant");

        const response = await axiosClient.put("?endpoint=updateA", affectation);
        if (!response.data.success) throw new Error(response.data.message);

        return response.data.updated || affectation; // PHP peut aussi retourner les données mises à jour
    }
);