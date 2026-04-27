import { createSlice } from "@reduxjs/toolkit";
import { getCategories } from "../thunks/getCategoriesThunk";
import { addCategory } from "../thunks/addCategoryThunk";
import { updateCategory } from "../thunks/updateCategoryThunk";
import { deleteCategory } from "../thunks/deleteCategoryThunk";

const initialState = {
  fournitures: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "fournitures",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // GET
    builder.addCase(getCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.fournitures = action.payload;
    });
    builder.addCase(getCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // ADD
    builder.addCase(addCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.fournitures.push(action.payload);
    });
    builder.addCase(addCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // UPDATE
    builder.addCase(updateCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.fournitures.findIndex(
        (c) => c.id_fourniture === action.payload.id_fourniture,
      );
      if (index !== -1) state.fournitures[index] = action.payload;
    });
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // DELETE
    builder.addCase(deleteCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.fournitures = state.fournitures.filter(
        (c) => c.id_fourniture !== action.payload,
      );
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default categorySlice.reducer;
