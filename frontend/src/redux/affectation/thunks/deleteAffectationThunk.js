import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiaffectation/axiosClient";

export const deleteAffectation = createAsyncThunk(
    "affectations/deleteAffectation",
    async (id_affe) => {
        const response = await axiosClient.delete("?endpoint=deleteA", { data: { id_affe } });
        if (!response.data.success) throw new Error(response.data.message);
        return id_affe;
    }
);