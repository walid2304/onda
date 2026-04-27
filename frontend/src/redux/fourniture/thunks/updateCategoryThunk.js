import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apicategorie/axiosClient";

export const updateCategory = createAsyncThunk(
  "fournitures/updateFourniture",
  async (fourniture) => {
    const response = await axiosClient.put(
      `?endpoint=updateC&id=${fourniture.id_fourniture}`,
      fourniture,
    );
    if (!response.data.success) throw new Error(response.data.message);
    return {
      id_fourniture: fourniture.id_fourniture,
      nom_fourniture: fourniture.nom_fourniture,
    };
  },
);
