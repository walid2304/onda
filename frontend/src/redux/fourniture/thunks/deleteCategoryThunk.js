import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apicategorie/axiosClient";

export const deleteCategory = createAsyncThunk(
  "fournitures/deleteFourniture",
  async (id) => {
    const response = await axiosClient.delete("?endpoint=deleteC", {
      data: { id_fourniture: id },
    });

    if (!response.data.success) throw new Error(response.data.message);

    return id;
  },
);
