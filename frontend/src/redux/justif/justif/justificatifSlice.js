import { createSlice } from "@reduxjs/toolkit";
import { getJustificatifsThunk } from "../thunks/getJustificatifsThunk";
import { uploadJustificatifThunk } from "../thunks/uploadJustificatifThunk";
import { deleteJustificatifThunk } from "../thunks/deleteJustificatifThunk";

const initialState = {
  justificatifs: [],
  loading: false,
  error: null,
};

const justificatifSlice = createSlice({
  name: "justificatif",
  initialState,
  reducers: {
    resetJustificatifs: (state) => {
      state.justificatifs = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getJustificatifsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJustificatifsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.justificatifs = action.payload;
      })
      .addCase(getJustificatifsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // UPLOAD
      .addCase(uploadJustificatifThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadJustificatifThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.justificatifs.unshift(action.payload); // ajouter au début
      })
      .addCase(uploadJustificatifThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // DELETE
      .addCase(deleteJustificatifThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJustificatifThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.justificatifs = state.justificatifs.filter(
          (j) => j.id_justificatif !== action.payload,
        );
      })
      .addCase(deleteJustificatifThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetJustificatifs } = justificatifSlice.actions;
export default justificatifSlice.reducer;
