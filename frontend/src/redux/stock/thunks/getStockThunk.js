import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apistock/axiosClient";

export const getStock = createAsyncThunk(
    "stock/getStock",
    async () => {
        const response = await axiosClient.get("?endpoint=readS");
        return response.data.data || [];
    }
);