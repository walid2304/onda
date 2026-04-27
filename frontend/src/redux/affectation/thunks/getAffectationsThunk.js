import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiaffectation/axiosClient";

export const getAffectations = createAsyncThunk(
    "affectations/getAffectations",
    async () => {
        const response = await axiosClient.get("?endpoint=readA");
        return response.data.data || [];
    }
);