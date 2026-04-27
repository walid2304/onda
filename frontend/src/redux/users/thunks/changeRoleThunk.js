import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiusers/axiosClient";

export const changeRole = createAsyncThunk(
    "auth/changeRole",
    async (data) => {

        const response = await axiosClient.post("?endpoint=change_role",data);

        return response.data;
    }
);