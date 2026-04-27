import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apimateriel/axiosClient";

export const updateMateriel = createAsyncThunk(
    "materiels/updateMateriel",
    async (materiel) => {
        const response = await axiosClient.put("?endpoint=updateM", materiel);
        if (response.data.success) {
            return response.data.data; // matériel complet avec nom_categorie
        } else {
            throw new Error(response.data.message || "Erreur modification matériel");
        }
    }
);