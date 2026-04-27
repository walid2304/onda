import axios from "axios";

const axiosClient = axios.create({
  baseURL:
    "http://localhost/gestion_stock-onda-2fd7d866fcd83965731011b3115bc0186dd89b16/backend/api/categorieApi.php",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
