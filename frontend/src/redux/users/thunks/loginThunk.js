import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiusers/axiosClient";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (data) => {

        const response = await axiosClient.post("?endpoint=login",data);

        return response.data;
    }
);