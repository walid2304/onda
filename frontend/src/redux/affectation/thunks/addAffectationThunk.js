import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiaffectation/axiosClient";

export const addAffectation = createAsyncThunk(
    "affectations/addAffectation",
    async (affectation) => {
        const response = await axiosClient.post("?endpoint=createA", affectation);
        if (!response.data.success) throw new Error(response.data.message);
        return response.data.data; // <-- contient nom_service maintenant
    }
);