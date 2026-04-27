import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apimouvements/axiosClient";

export const updateMouvement = createAsyncThunk(
    "mouvements/updateMouvement",
    async (mouvement) => {
        const response = await axiosClient.put("?endpoint=updateMo", mouvement);

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        return mouvement;
    }
);