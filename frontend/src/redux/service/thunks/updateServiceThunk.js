import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiservice/axiosClient";

export const updateService = createAsyncThunk(
    "services/updateService",
    async (service) => {
        const response = await axiosClient.put("?endpoint=updateSe", service);
        if (!response.data.success) throw new Error(response.data.message);
        return response.data.data;
    }
);