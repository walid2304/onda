import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiusers/axiosClient";

export const updateUser = createAsyncThunk(
    "auth/updateUser",
    async (data) => {
        const response = await axiosClient.post("?endpoint=modifier", data);
        // retourne la vraie donnée mise à jour par le serveur
        return response.data;
    }
);