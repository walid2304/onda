import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/users/auth/authSlice";
import categoryReducer from "../redux/fourniture/categorie/categorySlice";
import materielReducer from "./materiel/materiel/materielSlice";
import serviceReducer from "../redux/service/service/serviceSlice";
import affectationSlice from "../redux/affectation/affectation/affectationSlice";
import stockReducer from "../redux/stock/stock/stockSlice";
import mouvementsReducer from "../redux/mouvements/mouvements/mouvementSlice";
import demandeReducer from "../redux/demande/demande/demandesSlice";
import bonSortieReducer from "../redux/bon_sortie/bon_sortie/bonSortieSlice";
import justificatifReducer from "../redux/justif/justif/justificatifSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    categorie: categoryReducer,
    materiel: materielReducer,
    service: serviceReducer,
    affectation: affectationSlice,
    stock: stockReducer,
    mouvements: mouvementsReducer,
    demande: demandeReducer,
    bonSortie: bonSortieReducer,
    justificatif: justificatifReducer,
  },
});
