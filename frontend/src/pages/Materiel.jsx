import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getMateriels } from "../redux/materiel/thunks/getMaterielsThunk";
import { addMateriel } from "../redux/materiel/thunks/addMaterielThunk";
import { updateMateriel } from "../redux/materiel/thunks/updateMaterielThunk";
import { deleteMateriel } from "../redux/materiel/thunks/deleteMaterielThunk";

import { getCategories } from "../redux/fourniture/thunks/getCategoriesThunk";

const Materiel = () => {
  const dispatch = useDispatch();

  const { materiels, loading, error } = useSelector((state) => state.materiel);
  const { fournitures: categories } = useSelector((state) => state.categorie);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);
  const [newMateriel, setNewMateriel] = useState({
    designation: "",
    id_fourniture: "",
  });

  const [editMateriel, setEditMateriel] = useState(null);
  const [idmateriel, setidmateriel] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const showDeleteBar = (id) => {
    setidmateriel(id);
  };

  const cancelDelete = () => {
    setidmateriel(null);
  };

  const confirmDelete = async (id) => {
    try {
      await dispatch(deleteMateriel(id)).unwrap();
      setSuccessMessage("Matériel supprimé avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
      setErrorMessage("Erreur lors de la suppression");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setidmateriel(null);
    }
  };

  useEffect(() => {
    dispatch(getMateriels());
    dispatch(getCategories());
  }, [dispatch]);

  const closeModal = () => {
    setModalOpen(false);
    setEditMateriel(null);
    setNewMateriel({
      designation: "",
      id_fourniture: "",
    });
  };

  const handleAddMateriel = async () => {
    if (!newMateriel.designation.trim()) {
      alert("La désignation est obligatoire");
      return;
    }
    if (!newMateriel.id_fourniture) {
      alert("La fourniture est obligatoire");
      return;
    }
    try {
      await dispatch(addMateriel(newMateriel)).unwrap();
      setSuccessMessage("Materiel ajoutée avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
      setModalOpen(false);
      setNewMateriel({ designation: "", id_fourniture: "" });
    } catch (err) {
      console.error("Erreur lors de l'ajout", err);
      setErrorMessage("Erreur lors de l'ajout");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleEditMateriel = (materiel) => {
    setEditMateriel(materiel);

    setNewMateriel({
      designation: materiel.designation,
      id_fourniture: materiel.id_fourniture,
    });

    setModalOpen(true);
  };

  const handleUpdateMateriel = async () => {
    if (!newMateriel.designation.trim()) {
      alert("La désignation est obligatoire");
      return;
    }
    if (!newMateriel.id_fourniture) {
      alert("La fourniture est obligatoire");
      return;
    }
    try {
      await dispatch(
        updateMateriel({
          id_materiel: editMateriel.id_materiel,
          designation: newMateriel.designation,
          id_fourniture: newMateriel.id_fourniture,
        }),
      ).unwrap();
      setSuccessMessage("Matériel modifié avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
      closeModal();
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
            Gestion des matériels
          </h1>

          <p className="text-gray-500 text-sm">
            Inventaire du matériel informatique
          </p>
        </div>

        {currentUser?.role === "admin" && (
          <button
            onClick={() => {
              setModalOpen(true);
              setEditMateriel(null);
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Nouveau matériel
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
              <th className="px-6 py-3 text-center">Nom de matériel</th>
              <th className="px-6 py-3 text-center">Fourniture</th>
              {currentUser?.role === "admin" && (
                <th className="px-6 py-3 text-center">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y">
            {materiels.map((m, index) => (
              <tr key={m.id_materiel} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-center">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-gray-800 text-center">
                  {m.designation}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
                    {m.nom_fourniture}
                  </span>
                </td>
                {currentUser?.role === "admin" && (
                  <td className="px-6 py-4 text-center space-x-2">
                    {idmateriel === m.id_materiel ? (
                      <div className="flex justify-center gap-2 bg-red-100 px-2 rounded">
                        <button
                          onClick={() => confirmDelete(m.id_materiel)}
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
                          onClick={() => handleEditMateriel(m)}
                          className="px-3 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => showDeleteBar(m.id_materiel)}
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

            {materiels.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400">
                  Aucun matériel trouvé
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
              {editMateriel ? "Modifier matériel" : "Ajouter matériel"}
            </h2>

            <div className="space-y-3">
              <input
                placeholder="Désignation"
                value={newMateriel.designation}
                onChange={(e) =>
                  setNewMateriel({
                    ...newMateriel,
                    designation: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={newMateriel.id_fourniture}
                onChange={(e) =>
                  setNewMateriel({
                    ...newMateriel,
                    id_fourniture: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Choisir une fourniture</option>

                {categories.map((c) => (
                  <option key={c.id_fourniture} value={c.id_fourniture}>
                    {c.nom_fourniture}
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
                  editMateriel ? handleUpdateMateriel : handleAddMateriel
                }
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editMateriel ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materiel;
