import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getStock } from "../redux/stock/thunks/getStockThunk";
import { addStock } from "../redux/stock/thunks/addStockThunk";
import { updateStock } from "../redux/stock/thunks/updateStockThunk";
import { deleteStock } from "../redux/stock/thunks/deleteStockThunk";
import { getMateriels } from "../redux/materiel/thunks/getMaterielsThunk";

const Stock = () => {
  const dispatch = useDispatch();

  const { stocks, loading, error } = useSelector((state) => state.stock);
  const { materiels } = useSelector((state) => state.materiel);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);
  const [editStock, setEditStock] = useState(null);

  const [newStock, setNewStock] = useState({
    id_materiel: "",
    qte_stock: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [idSToDelete, setIdSToDelete] = useState(null);

  useEffect(() => {
    dispatch(getStock());
    dispatch(getMateriels());
  }, [dispatch]);

  const closeModal = () => {
    setModalOpen(false);
    setEditStock(null);
    setNewStock({ id_materiel: "", qte_stock: "" });
    setSuccessMessage("");
    setErrorMessage("");
  };

  const showMessage = (message, type = "success") => {
    if (type === "success") {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const showDeleteBar = (id) => {
    setIdSToDelete(id);
  };

  const cancelDelete = () => {
    setIdSToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteStock(idSToDelete)).unwrap();
      showMessage("Stock supprimé avec succès");
      dispatch(getStock());
      setIdSToDelete(null);
    } catch (err) {
      showMessage("Erreur lors de la suppression du stock", "error");
      setIdSToDelete(null);
    }
  };

  const handleAddStock = async () => {
    if (!newStock.id_materiel || !newStock.qte_stock) {
      showMessage("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }

    try {
      await dispatch(addStock(newStock)).unwrap();
      setSuccessMessage("Stock ajouté avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
      setModalOpen(false);
      setNewStock({ id_materiel: "", qte_stock: "" });
    } catch (err) {
      console.error("Erreur lors de l'ajout du stock", err);
      setErrorMessage("Erreur lors de l'ajout du stock");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleEditStock = (stock) => {
    setEditStock(stock);
    setNewStock({
      id_materiel: stock.id_materiel,
      qte_stock: stock.qte_stock,
    });

    setModalOpen(true);
  };

  const handleUpdateStock = async () => {
    if (!newStock.id_materiel || !newStock.qte_stock) {
      alert("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }
    try {
      await dispatch(
        updateStock({
          id_stock: editStock.id_stock,
          id_materiel: newStock.id_materiel,
          qte_stock: newStock.qte_stock,
        }),
      ).unwrap();
      setSuccessMessage("Stock modifié avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
      setModalOpen(false);
      setEditStock(null);
      setNewStock({ id_materiel: "", qte_stock: "" });
    } catch (err) {
      console.error("Erreur lors de la modification du stock", err);
      setErrorMessage("Erreur lors de la modification du stock");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const filteredStocks = stocks.filter((s) => {
    const term = searchTerm.toLowerCase();
    const designation = s.designation.toLowerCase();
    return designation.includes(term);
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion du stock</h1>

          <p className="text-gray-500 text-sm">
            Gestion des quantités de matériel disponibles
          </p>
        </div>

        {currentUser?.role === "admin" && (
          <button
            onClick={() => {
              setEditStock(null);
              setNewStock({ id_materiel: "", qte_stock: "" });
              setModalOpen(true);
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Ajouter stock
          </button>
        )}
      </div>

      {loading && (
        <div className="text-center py-10 text-gray-500">Chargement...</div>
      )}

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>
      )}
      {successMessage && (
        <div className="bg-green-100 text-green-600 p-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label className="text-sm font-semibold text-gray-600">
            Rechercher
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par matériel"
            className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3 text-center">#</th>
              <th className="px-6 py-3 text-center">Matériel</th>
              <th className="px-6 py-3 text-center">Quantité</th>
              <th className="px-6 py-3 text-center">Date mise à jour</th>
              {currentUser?.role === "admin" && (
                <th className="px-6 py-3 text-center">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredStocks.length > 0 ? (
              filteredStocks.map((s, index) => (
                <tr key={s.id_stock} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-center">{index + 1}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                      {s.designation}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700 text-center">
                    {s.qte_stock}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-center">
                    {s.date_maj}
                  </td>
                  {currentUser?.role === "admin" && (
                    <td className="px-6 py-4 text-center space-x-2">
                      {idSToDelete === s.id_stock ? (
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
                            onClick={() => handleEditStock(s)}
                            className="px-3 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => showDeleteBar(s.id_stock)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Supprimer
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={currentUser?.role === "admin" ? 5 : 4}
                  className="text-center py-10 text-gray-400"
                >
                  Aucun stock disponible
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
              {editStock ? "Modifier stock" : "Ajouter stock"}
            </h2>

            <div className="space-y-3">
              <select
                value={newStock.id_materiel}
                onChange={(e) =>
                  setNewStock({
                    ...newStock,
                    id_materiel: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Choisir un matériel</option>

                {materiels.map((m) => (
                  <option key={m.id_materiel} value={m.id_materiel}>
                    {m.designation} ({m.marque} {m.modele})
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Quantité"
                value={newStock.qte_stock}
                onChange={(e) =>
                  setNewStock({
                    ...newStock,
                    qte_stock: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
                min="0"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>

              <button
                onClick={editStock ? handleUpdateStock : handleAddStock}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editStock ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
