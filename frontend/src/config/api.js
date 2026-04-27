const DEFAULT_BACKEND_BASE_URL =
  "http://localhost/gestion_stock-onda-2fd7d866fcd83965731011b3115bc0186dd89b16/backend";

const backendBaseUrl = (
  process.env.REACT_APP_BACKEND_BASE_URL || DEFAULT_BACKEND_BASE_URL
).replace(/\/+$/, "");

export const apiUrl = (scriptName) =>
  `${backendBaseUrl}/api/${scriptName.replace(/^\/+/, "")}`;

export const fileUrl = (fileName) =>
  `${backendBaseUrl}/serve-file.php?file=${encodeURIComponent(fileName)}`;

export default backendBaseUrl;
