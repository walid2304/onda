import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAffectations } from "../redux/affectation/thunks/getAffectationsThunk";
import { addAffectation } from "../redux/affectation/thunks/addAffectationThunk";
import { updateAffectation } from "../redux/affectation/thunks/updateAffectationThunk";
import { deleteAffectation } from "../redux/affectation/thunks/deleteAffectationThunk";

import { getServices } from "../redux/service/thunks/getServicesThunk";

const Affectation = () => {
  const dispatch = useDispatch();

  const { affectations, loading, error } = useSelector(
    (state) => state.affectation,
  );
  const { services } = useSelector((state) => state.service);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);
  const [editAffectation, setEditAffectation] = useState(null);
  const [idaffec, setIdaffec] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [newAffectation, setNewAffectation] = useState({
    nom: "",
    email: "",
    phone: "",
    id_service: "",
  });

  const showDeleteBar = (id) => {
    setIdaffec(id);
  };

  const cancelDelete = () => {
    setIdaffec(null);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteAffectation(idaffec)).unwrap();
      dispatch(getAffectations());
      setSuccessMessage("Affectation supprimée avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
      setErrorMessage("Erreur lors de la suppression");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIdaffec(null);
    }
  };

  useEffect(() => {
    dispatch(getAffectations());
    dispatch(getServices());
  }, [dispatch]);

  const openAddModal = () => {
    setEditAffectation(null);
    setNewAffectation({ nom: "", email: "", phone: "", id_service: "" });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditAffectation(null);
    setNewAffectation({ nom: "", email: "", phone: "", id_service: "" });
  };

  const handleAddAffectation = async () => {
    if (!newAffectation.nom.trim()) {
      alert("Nom requis");
      return;
    }

    try {
      await dispatch(addAffectation(newAffectation)).unwrap();
      // Recharger les affectations pour synchroniser partout
      await dispatch(getAffectations()).unwrap();
      setSuccessMessage("Affectation ajoutée avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
      setModalOpen(false);
      setNewAffectation({ nom: "" });
    } catch (err) {
      console.error("Erreur lors de l'ajout", err);
      setErrorMessage("Erreur lors de l'ajout");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleEditAffectation = (aff) => {
    setEditAffectation(aff);

    setNewAffectation({
      nom: aff.nom,
      email: aff.email,
      phone: aff.phone,
      id_service: aff.id_service,
    });

    setModalOpen(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (editAffectation) {
        handleUpdateAffectation();
      } else {
        handleAddAffectation();
      }
    }
  };

  const handleUpdateAffectation = async () => {
    if (!newAffectation.nom.trim()) {
      alert("Le nom d'affectation est obligatoire");
      return;
    }
    try {
      await dispatch(
        updateAffectation({
          ...newAffectation,
          id_affe: editAffectation.id_affe,
        }),
      ).unwrap();
      // Recharger les affectations pour synchroniser partout
      await dispatch(getAffectations()).unwrap();
      setSuccessMessage("Affectation modifiée avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
      setModalOpen(false);
      setEditAffectation(null);
      setNewAffectation({ nom: "", email: "", phone: "", id_service: "" });
    } catch (err) {
      console.error("Erreur lors de la modification", err);
      setErrorMessage("Erreur lors de la modification");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Gestion des affectations
          </h1>

          <p className="text-gray-500 text-sm">
            Attribution des utilisateurs aux services
          </p>
        </div>

        {currentUser?.role === "admin" && (
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Nouvelle affectation
          </button>
        )}
      </div>

      {loading && (
        <div className="text-center py-10 text-gray-500">Chargement...</div>
      )}

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>
      )}

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3 text-center">#</th>
              <th className="px-6 py-3 text-center">Nom</th>
              <th className="px-6 py-3 text-center">Email</th>
              <th className="px-6 py-3 text-center">Téléphone</th>
              <th className="px-6 py-3 text-center">Service</th>
              {currentUser?.role === "admin" && (
                <th className="px-6 py-3 text-center">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y">
            {affectations.map((aff, index) => (
              <tr key={aff.id_affe} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-center">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-gray-800 text-center">
                  {aff.nom}
                </td>
                <td className="px-6 py-4 text-gray-600 text-center">
                  {aff.email}
                </td>
                <td className="px-6 py-4 text-gray-600 text-center">
                  {aff.phone}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                    {aff.nom_service}
                  </span>
                </td>
                {currentUser?.role === "admin" && (
                  <td className="px-6 py-4 text-center space-x-2">
                    {idaffec === aff.id_affe ? (
                      <div className="flex justify-center gap-2 bg-red-100 px-2 rounded">
                        <button
                          onClick={confirmDelete}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 font-bold"
                        >
                          ✓ Confirmer
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          ✕ Annuler
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditAffectation(aff)}
                          className="px-3 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => showDeleteBar(aff.id_affe)}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}

            {affectations.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-400">
                  Aucune affectation trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              {editAffectation ? "Modifier affectation" : "Ajouter affectation"}
            </h2>

            <div className="space-y-3">
              <input
                placeholder="Nom"
                value={newAffectation.nom}
                onChange={(e) =>
                  setNewAffectation({
                    ...newAffectation,
                    nom: e.target.value,
                  })
                }
                onKeyPress={handleKeyPress}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                placeholder="Email"
                value={newAffectation.email}
                onChange={(e) =>
                  setNewAffectation({
                    ...newAffectation,
                    email: e.target.value,
                  })
                }
                onKeyPress={handleKeyPress}
                className="w-full border px-3 py-2 rounded"
              />

              <input
                placeholder="Téléphone"
                value={newAffectation.phone}
                onChange={(e) =>
                  setNewAffectation({
                    ...newAffectation,
                    phone: e.target.value,
                  })
                }
                onKeyPress={handleKeyPress}
                className="w-full border px-3 py-2 rounded"
              />

              <select
                value={newAffectation.id_service}
                onChange={(e) =>
                  setNewAffectation({
                    ...newAffectation,
                    id_service: e.target.value,
                  })
                }
                onKeyPress={handleKeyPress}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Choisir un service</option>

                {services.map((s) => (
                  <option key={s.id_service} value={s.id_service}>
                    {s.nom_service}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>

              <button
                onClick={
                  editAffectation
                    ? handleUpdateAffectation
                    : handleAddAffectation
                }
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editAffectation ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Affectation;
