import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apimateriel/axiosClient";

export const deleteMateriel = createAsyncThunk(
    "materiels/deleteMateriel",
    async (id_materiel) => {

        await axiosClient.delete("?endpoint=deleteM", {
            data: { id_materiel }
        });

        return id_materiel;
    }
);