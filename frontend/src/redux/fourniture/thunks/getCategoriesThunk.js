import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apicategorie/axiosClient";

export const getCategories = createAsyncThunk(
  "fournitures/getFournitures",
  async () => {
    const response = await axiosClient.get("?endpoint=readC");

    return response.data.data || [];
  },
);
