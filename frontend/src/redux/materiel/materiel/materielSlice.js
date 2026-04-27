import { createSlice } from "@reduxjs/toolkit";

import { getMateriels } from "../thunks/getMaterielsThunk";
import { addMateriel } from "../thunks/addMaterielThunk";
import { updateMateriel } from "../thunks/updateMaterielThunk";
import { deleteMateriel } from "../thunks/deleteMaterielThunk";
import {getMaterielsES} from "../thunks/getMaterielESThunks"
const initialState = {
    materiels: [],
    loading: false,
    error: null,
};

const materielSlice = createSlice({
    name: "materiels",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        // GET
        builder.addCase(getMateriels.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(getMateriels.fulfilled, (state, action) => {
            state.loading = false;
            state.materiels = action.payload;
        });

        builder.addCase(getMateriels.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });


        // GETES
        builder.addCase(getMaterielsES.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(getMaterielsES.fulfilled, (state, action) => {
            state.loading = false;
            state.materiels = action.payload;
        });

        builder.addCase(getMaterielsES.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // ADD
        builder.addCase(addMateriel.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(addMateriel.fulfilled, (state, action) => {
            state.loading = false;
            state.materiels.push(action.payload);
        });

        builder.addCase(addMateriel.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });


        // UPDATE
        builder.addCase(updateMateriel.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(updateMateriel.fulfilled, (state, action) => {
            state.loading = false;

            const index = state.materiels.findIndex(
                (m) => m.id_materiel === action.payload.id_materiel
            );

            if (index !== -1) {
                state.materiels[index] = action.payload;
            }
        });

        builder.addCase(updateMateriel.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });


        // DELETE
        builder.addCase(deleteMateriel.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(deleteMateriel.fulfilled, (state, action) => {
            state.loading = false;

            state.materiels = state.materiels.filter(
                (m) => m.id_materiel !== action.payload
            );
        });

        builder.addCase(deleteMateriel.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export default materielSlice.reducer;