import { createSlice } from "@reduxjs/toolkit";
import { getServices } from "../thunks/getServicesThunk";
import { addService } from "../thunks/addServiceThunk";
import { updateService } from "../thunks/updateServiceThunk";
import { deleteService } from "../thunks/deleteServiceThunk";

const initialState = {
    services: [],
    loading: false,
    error: null
};

const serviceSlice = createSlice({
    name: "service",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // GET
        builder.addCase(getServices.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getServices.fulfilled, (state, action) => {
            state.loading = false;
            state.services = action.payload;
        });
        builder.addCase(getServices.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // ADD
        builder.addCase(addService.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addService.fulfilled, (state, action) => {
            state.loading = false;
            state.services.push(action.payload);
        });
        builder.addCase(addService.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // UPDATE
        builder.addCase(updateService.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateService.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.services.findIndex(s => s.id_service === action.payload.id_service);
            if (index !== -1) state.services[index] = action.payload;
        });
        builder.addCase(updateService.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // DELETE
        builder.addCase(deleteService.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteService.fulfilled, (state, action) => {
            state.loading = false;
            state.services = state.services.filter(s => s.id_service !== action.payload);
        });
        builder.addCase(deleteService.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
});

export default serviceSlice.reducer;