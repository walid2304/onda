import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apijustif/axiosClient";

export const getJustificatifsThunk = createAsyncThunk(
    "justificatif/get",
    async (id_mouvement, { rejectWithValue }) => {
        try {
            const res = await axiosClient.get(`?endpoint=readJ&id_mouvement=${id_mouvement}`);
            if (res.data.success) return res.data.data;
            return rejectWithValue(res.data.message);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);