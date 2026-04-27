import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../redux/fourniture/thunks/getCategoriesThunk";
import { addCategory } from "../redux/fourniture/thunks/addCategoryThunk";
import { updateCategory } from "../redux/fourniture/thunks/updateCategoryThunk";
import { deleteCategory } from "../redux/fourniture/thunks/deleteCategoryThunk";

const Category = () => {
  const dispatch = useDispatch();

  const { fournitures, loading, error } = useSelector(
    (state) => state.categorie,
  );
  const { user: currentUser } = useSelector((state) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);
  const [newFourniture, setNewFourniture] = useState({ nom_fourniture: "" });
  const [editFourniture, setEditFourniture] = useState(null);

  const [idfourniture, setidfourniture] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const showDeleteBar = (id) => {
    setidfourniture(id);
  };

  const cancelDelete = () => {
    setidfourniture(null);
  };

  const confirmDelete = async (id) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
      setSuccessMessage("Fourniture supprimée avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
      setErrorMessage("Erreur lors de la suppression");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setidfourniture(null);
    }
  };

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleAddFourniture = async () => {
    if (!newFourniture.nom_fourniture.trim()) {
      alert("Le nom de la fourniture est obligatoire");
      return;
    }

    try {
      await dispatch(addCategory(newFourniture)).unwrap();
      setSuccessMessage("Fourniture ajoutée avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
      setModalOpen(false);
      setNewFourniture({ nom_fourniture: "" });
    } catch (err) {
      console.error("Erreur lors de l'ajout", err);
      setErrorMessage("Erreur lors de l'ajout");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleEditFourniture = (fourniture) => {
    setEditFourniture(fourniture);
    setNewFourniture({ nom_fourniture: fourniture.nom_fourniture });
    setModalOpen(true);
  };

  const handleUpdateFourniture = async () => {
    if (!newFourniture.nom_fourniture.trim()) {
      alert("Le nom de la fourniture est obligatoire");
      return;
    }

    try {
      await dispatch(
        updateCategory({
          id_fourniture: editFourniture.id_fourniture,
          nom_fourniture: newFourniture.nom_fourniture,
        }),
      ).unwrap();
      setSuccessMessage("Fourniture modifiée avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
      setModalOpen(false);
      setEditFourniture(null);
      setNewFourniture({ nom_fourniture: "" });
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
            Gestion des fournitures
          </h1>

          <p className="text-gray-500 text-sm">
            Organiser les fournitures des produits
          </p>
        </div>

        {currentUser?.role === "admin" && (
          <button
            onClick={() => {
              setModalOpen(true);
              setEditFourniture(null);
              setNewFourniture({ nom_fourniture: "" });
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Nouvelle fourniture
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
              <th className="px-6 py-3 text-center">Nom de Fourniture</th>
              {currentUser?.role === "admin" && (
                <th className="px-6 py-3 text-center">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y">
            {fournitures.map((cat, index) => (
              <tr
                key={cat.id_fourniture}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 text-center">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-gray-800 text-center">
                  {cat.nom_fourniture}
                </td>

                {currentUser?.role === "admin" && (
                  <td className="px-6 py-4 text-center space-x-2">
                    {idfourniture === cat.id_fourniture ? (
                      <div className="flex justify-center gap-2 bg-red-100 px-2 rounded">
                        <button
                          onClick={() => confirmDelete(cat.id_fourniture)}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="px-3 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditFourniture(cat)}
                          className="px-3 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => showDeleteBar(cat.id_fourniture)}
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

            {fournitures.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-10 text-gray-400">
                  Aucune fourniture trouvée
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
              {editFourniture
                ? "Modifier la fourniture"
                : "Ajouter une fourniture"}
            </h2>

            <input
              type="text"
              placeholder="Nom de la fourniture"
              value={newFourniture.nom_fourniture}
              onChange={(e) =>
                setNewFourniture({
                  nom_fourniture: e.target.value,
                })
              }
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>

              <button
                onClick={
                  editFourniture ? handleUpdateFourniture : handleAddFourniture
                }
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700\"
              >
                {editFourniture ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
