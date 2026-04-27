import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiusers/axiosClient";

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (data) => {

        const response = await axiosClient.post("?endpoint=register",data);

        return response.data;
    }
);