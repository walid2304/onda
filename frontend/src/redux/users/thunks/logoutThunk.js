import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiusers/axiosClient";

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async () => {

        const response = await axiosClient.get("?endpoint=deconnexion");

        return response.data;
    }
);