import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiservice/axiosClient";

export const addService = createAsyncThunk(
    "services/addService",
    async (service) => {
        const response = await axiosClient.post("?endpoint=createSe", service);
        if (!response.data.success) throw new Error(response.data.message);
        // retourner le service ajouté pour mettre à jour le state
        return { ...service, id_service: response.data.id_service || Math.random() };
    }
);