import { Routes, Route,Navigate } from "react-router-dom";
// import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/layouts/Layout";
import ProtectedRoute from "./components/layouts/ProtectedRoute";
import Users from "./pages/Users";
import Category from "./pages/Category";
import Materiel from "./pages/Materiel";
import Service from "./pages/Service"
import Affectation from "./pages/Affectation";
import Stock from "./pages/Stock";
import Mouvements from "./pages/Mouvements";
import Demande from "./pages/Demande";
import BonSortie from "./pages/BonSortie";
import Settings from "./pages/settings";
export default function App() {
  return (
    <>
      {/* <Toaster position="top-right" reverseOrder={false} /> */}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users/>}/>
            <Route path="/categorie" element={<Category/>}/>
            <Route path="/materiel" element={<Materiel/>}/>
            <Route path="/service" element={<Service/>}/>
            <Route path="/affectation" element={<Affectation/>}/>
            <Route path="/stock" element={<Stock/>}/>
            <Route path="/mouvements" element={<Mouvements/>}/>
            <Route path="/demande" element={<Demande/>}/>
            <Route path="/bon-sortie" element={<BonSortie/>}/>
            <Route path="/settings" element={<Settings/>}/>
          </Route>
        </Route>
      </Routes>
    </>
  );
}