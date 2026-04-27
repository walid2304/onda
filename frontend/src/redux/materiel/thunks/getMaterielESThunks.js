import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apimateriel/axiosClient";

export const getMaterielsES = createAsyncThunk(
    "materiels/getMaterielsES",
    async () => {
        const response = await axiosClient.get("?endpoint=lectureM");

        return response.data.data || [];
    }
);