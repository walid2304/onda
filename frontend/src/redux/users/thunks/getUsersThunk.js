import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiusers/axiosClient";

export const getUsers = createAsyncThunk(
    "auth/getUsers",
    async () => {

        const response = await axiosClient.get("?endpoint=toutUtilisateur");

        return response.data;
    }
);