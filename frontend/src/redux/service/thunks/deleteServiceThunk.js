import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiservice/axiosClient";

export const deleteService = createAsyncThunk(
    "services/deleteService",
    async (id_service) => {
        const response = await axiosClient.delete("?endpoint=deleteSe", { data: { id_service } });
        if (!response.data.success) throw new Error(response.data.message);
        return id_service; // retourne l'ID supprimé
    }
);