import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apijustif/axiosClient";

export const deleteJustificatifThunk = createAsyncThunk(
    "justificatif/delete",
    async (id_justificatif, { rejectWithValue }) => {
        try {
            const res = await axiosClient.post("?endpoint=deleteJ", { id_justificatif });
            if (res.data.success) return id_justificatif;
            return rejectWithValue(res.data.message);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);