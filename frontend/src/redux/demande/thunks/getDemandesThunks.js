import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apidemande/axiosClient";

export const getDemandes = createAsyncThunk(
    "demandes/getDemandes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get("?endpoint=readD");
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);