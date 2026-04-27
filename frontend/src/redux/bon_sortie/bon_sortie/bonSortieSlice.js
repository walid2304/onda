import { createSlice } from "@reduxjs/toolkit";
import { getBonSorties } from "../thunks/getBonSortieThunks";
import { createBonSortie } from "../thunks/createBonSortieThunks";
import { updateBonSortie } from "../thunks/updateBonSortieThunks";
import { deleteBonSortie } from "../thunks/deleteBonSortieThunk";

const initialState = {
  bonSorties: [],
  loading: false,
  error: null,
};

const bonSortieSlice = createSlice({
  name: "bonSortie",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // GET
    builder.addCase(getBonSorties.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getBonSorties.fulfilled, (state, action) => {
      state.loading = false;
      state.bonSorties = action.payload;
    });
    builder.addCase(getBonSorties.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // CREATE
    builder.addCase(createBonSortie.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createBonSortie.fulfilled, (state, action) => {
      state.loading = false;
      state.bonSorties.push(action.payload);
    });
    builder.addCase(createBonSortie.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // UPDATE
    builder.addCase(updateBonSortie.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateBonSortie.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.bonSorties.findIndex(
        (bs) => bs.id_bs === action.payload.id_bs,
      );
      if (index !== -1) state.bonSorties[index] = action.payload;
    });
    builder.addCase(updateBonSortie.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // DELETE
    builder.addCase(deleteBonSortie.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteBonSortie.fulfilled, (state, action) => {
      state.loading = false;
      state.bonSorties = state.bonSorties.filter(
        (bs) => bs.id_bs !== action.payload,
      );
    });
    builder.addCase(deleteBonSortie.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError } = bonSortieSlice.actions;
export default bonSortieSlice.reducer;
