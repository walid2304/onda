// Dans frontend/src/redux/justif/thunks/uploadJustificatifThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apijustif/axiosClient";

export const uploadJustificatifThunk = createAsyncThunk(
  "justificatifs/upload",
  async ({ id_mouvement, fichier }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("id_mouvement", id_mouvement);
      formData.append("fichier", fichier);

      const response = await axiosClient.post("?endpoint=createJ", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
