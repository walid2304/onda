import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apimouvements/axiosClient";

export const deleteMouvement = createAsyncThunk(
    "mouvements/deleteMouvement",
    async (id_mouv) => {
        const response = await axiosClient.post("?endpoint=deleteMo", {
            id_mouv,
        });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        return id_mouv;
    }
);