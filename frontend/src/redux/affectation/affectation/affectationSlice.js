import { createSlice } from "@reduxjs/toolkit";
import { getAffectations } from "../thunks/getAffectationsThunk";
import { addAffectation } from "../thunks/addAffectationThunk";
import { updateAffectation } from "../thunks/updateAffectationThunk";
import { deleteAffectation } from "../thunks/deleteAffectationThunk";

const initialState = {
    affectations: [],
    loading: false,
    error: null,
};

const affectationSlice = createSlice({
    name: "affectations",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // GET
        builder.addCase(getAffectations.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getAffectations.fulfilled, (state, action) => {
            state.loading = false;
            state.affectations = action.payload;
        });
        builder.addCase(getAffectations.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // ADD
        builder.addCase(addAffectation.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addAffectation.fulfilled, (state, action) => {
            state.loading = false;
            state.affectations.push(action.payload); // affichera nom_service immédiatement
        });
        builder.addCase(addAffectation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // UPDATE
        builder.addCase(updateAffectation.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateAffectation.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.affectations.findIndex(a => a.id_affe === action.payload.id_affe);
            if (index !== -1) state.affectations[index] = action.payload;
        });
        builder.addCase(updateAffectation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // DELETE
        builder.addCase(deleteAffectation.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteAffectation.fulfilled, (state, action) => {
            state.loading = false;
            state.affectations = state.affectations.filter(a => a.id_affe !== action.payload);
        });
        builder.addCase(deleteAffectation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export default affectationSlice.reducer;