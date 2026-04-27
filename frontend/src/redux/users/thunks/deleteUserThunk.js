import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apiusers/axiosClient";

export const deleteUser = createAsyncThunk(
    "auth/deleteUser",
    async (id_user) => {

        const response = await axiosClient.post("?endpoint=supprimer",{ id_user });

        return response.data;
    }
);