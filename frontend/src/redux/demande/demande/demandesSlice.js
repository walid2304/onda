import { createSlice } from "@reduxjs/toolkit";
import { getDemandes } from "../thunks/getDemandesThunks";
import { createDemande } from "../thunks/createDemandeThunks";
import { updateDemande } from "../thunks/updateDemandeThunks";
import { deleteDemande } from "../thunks/deleteDemandeThunks";

const demandeSlice = createSlice({
  name: "demandes",

  initialState: {
    demandes: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // GET
      .addCase(getDemandes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDemandes.fulfilled, (state, action) => {
        state.loading = false;
        state.demandes = action.payload;
      })
      .addCase(getDemandes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createDemande.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDemande.fulfilled, (state, action) => {
        state.loading = false;
        state.demandes.push(action.payload);
      })
      .addCase(createDemande.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateDemande.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDemande.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.demandes.findIndex(
          (d) => d.id_demande === action.payload.id_demande,
        );
        if (index !== -1) {
          state.demandes[index] = action.payload;
        }
      })
      .addCase(updateDemande.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteDemande.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDemande.fulfilled, (state, action) => {
        state.loading = false;
        state.demandes = state.demandes.filter(
          (d) => d.id_demande !== action.payload,
        );
      })
      .addCase(deleteDemande.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default demandeSlice.reducer;
