import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apimouvements/axiosClient";

export const addMouvement = createAsyncThunk(
    "mouvement/addMouvement",
    async (mouvement) => {
        const response = await axiosClient.post("?endpoint=createMo", mouvement);
        if (!response.data.success) throw new Error(response.data.message);
        return response.data.data;
    }
);