import { createSlice } from "@reduxjs/toolkit";

import { getMouvements } from "../thunks/getMouvementsThunks";
import { addMouvement } from "../thunks/addMouvementThunks";
import { updateMouvement } from "../thunks/updateMouvementsThunks";
import { deleteMouvement } from "../thunks/deleteMouvementThunks";

const mouvementsSlice = createSlice({

    name: "mouvements",

    initialState: {
        mouvements: [],
        loading: false,
        error: null
    },

    reducers: {},

    extraReducers: (builder) => {

        builder

        // =============================
        // GET MOUVEMENTS
        // =============================

        .addCase(getMouvements.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(getMouvements.fulfilled, (state, action) => {
            state.loading = false;
            state.mouvements = action.payload || [];
        })

        .addCase(getMouvements.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })


        // =============================
        // ADD MOUVEMENT
        // =============================

        .addCase(addMouvement.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(addMouvement.fulfilled, (state, action) => {

            state.loading = false;

            if (action.payload) {
                state.mouvements.unshift(action.payload);
            }

        })

        .addCase(addMouvement.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })


        // =============================
        // UPDATE MOUVEMENT
        // =============================

        .addCase(updateMouvement.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(updateMouvement.fulfilled, (state, action) => {

            state.loading = false;

            const index = state.mouvements.findIndex(
                (m) => m.id_mouv === action.payload.id_mouv
            );

            if (index !== -1) {
                state.mouvements[index] = {
                    ...state.mouvements[index],
                    ...action.payload
                };
            }

        })

        .addCase(updateMouvement.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })


        // =============================
        // DELETE MOUVEMENT
        // =============================

        .addCase(deleteMouvement.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(deleteMouvement.fulfilled, (state, action) => {

            state.loading = false;

            state.mouvements = state.mouvements.filter(
                (m) => m.id_mouv !== action.payload
            );

        })

        .addCase(deleteMouvement.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

    }

});

export default mouvementsSlice.reducer;