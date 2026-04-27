import axios from "axios";
import { apiUrl } from "../../../config/api";

const axiosClient = axios.create({
  baseURL: apiUrl("bon_sortieApi.php"),
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
