import axios from "axios";
import { apiUrl } from "../../../config/api";

const axiosClient = axios.create({
  baseURL: apiUrl("stockApi.php"),
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
