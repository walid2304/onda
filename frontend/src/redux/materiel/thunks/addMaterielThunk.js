import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apimateriel/axiosClient";

export const addMateriel = createAsyncThunk(
    "materiels/addMateriel",
    async (materiel) => {
        const response = await axiosClient.post("?endpoint=createM", materiel);
        
        // Retourner le matériel complet avec nom_categorie
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Erreur ajout matériel");
        }
    }
);