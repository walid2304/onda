import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiservice/axiosClient";

export const getServices = createAsyncThunk(
    "services/getServices",
    async () => {
        const response = await axiosClient.get("?endpoint=readSe");
        return response.data.data || [];
    }
);