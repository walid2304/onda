import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apicategorie/axiosClient";

export const addCategory = createAsyncThunk(
  "fournitures/addFourniture",
  async (fourniture) => {
    const response = await axiosClient.post("?endpoint=ajouterC", fourniture);
    if (!response.data.success) throw new Error(response.data.message);
    // Return the new fourniture object
    return response.data.fourniture;
  },
);
