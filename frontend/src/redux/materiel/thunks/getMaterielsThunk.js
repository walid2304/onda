import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apimateriel/axiosClient";

export const getMateriels = createAsyncThunk(
    "materiels/getMateriels",
    async () => {
        const response = await axiosClient.get("?endpoint=readM");

        return response.data.data || [];
    }
);