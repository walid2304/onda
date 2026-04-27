import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../apimouvements/axiosClient";

export const getMouvements = createAsyncThunk(
"mouvements/getMouvements",
async () => {

const response = await axiosClient.get("?endpoint=readMo");

return response.data.data;

}
);