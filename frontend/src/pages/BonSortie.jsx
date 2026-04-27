import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getBonSorties } from "../redux/bon_sortie/thunks/getBonSortieThunks";
import { createBonSortie } from "../redux/bon_sortie/thunks/createBonSortieThunks";
import { updateBonSortie } from "../redux/bon_sortie/thunks/updateBonSortieThunks";
import { deleteBonSortie } from "../redux/bon_sortie/thunks/deleteBonSortieThunk";
import { clearError } from "../redux/bon_sortie/bon_sortie/bonSortieSlice";

import { getDemandes } from "../redux/demande/thunks/getDemandesThunks";
const BonSortie = () => {
  const dispatch = useDispatch();

  const {
    bonSorties = [],
    loading,
    error,
  } = useSelector((state) => state.bonSortie);
  const { demandes = [] } = useSelector((state) => state.demande);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);
  const [editBS, setEditBS] = useState(null);
  const [newBS, setNewBS] = useState({
    code_bs: "",
    id_demande: "",
    date_sortie: "",
    nb_sortie: "",
    reste_livrer: "",
  });
  const [resteType, setResteType] = useState("solde"); // "solde" ou "custom"

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [idBSToDelete, setIdBSToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getBonSorties());
    dispatch(getDemandes());
  }, [dispatch]);

  useEffect(() => {
    console.log("Demandes reçues:", demandes);
  }, [demandes]);

  const closeModal = () => {
    setModalOpen(false);
    setEditBS(null);
    setNewBS({
      code_bs: "",
      id_demande: "",
      date_sortie: "",
      nb_sortie: "",
      reste_livrer: "",
    });
    setResteType("solde");
    setErrorMessage("");
    setSuccessMessage("");
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
    setIdBSToDelete(id);
  };

  const cancelDelete = () => {
    setIdBSToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteBonSortie(idBSToDelete)).unwrap();
      showMessage("Bon de sortie supprimé avec succès");
      dispatch(getBonSorties());
      setIdBSToDelete(null);
    } catch (err) {
      showMessage(err || "Erreur lors de la suppression du bon", "error");
      setIdBSToDelete(null);
    }
  };

  const handleAddBS = async () => {
    if (!newBS.id_demande || !newBS.date_sortie || !newBS.nb_sortie) {
      showMessage("Tous les champs sont obligatoires", "error");
      return;
    }

    try {
      console.log("Envoi:", newBS);
      await dispatch(createBonSortie(newBS)).unwrap();
      setSuccessMessage("Bon de sortie créé avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
      setModalOpen(false);
      setNewBS({
        code_bs: "",
        id_demande: "",
        date_sortie: "",
        nb_sortie: "",
        reste_livrer: "",
      });
      // Recharger les données
      dispatch(getBonSorties());
    } catch (err) {
      console.error("Erreur lors de l'ajout", err);
      setErrorMessage("Erreur lors de l'ajout");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // Vérifier si le stock est suffisant
  const demande = demandes.find((d) => d.id_demande === newBS.id_demande);
  if (demande && Number(newBS.nb_sortie) > Number(demande.quantite)) {
    showMessage(
      `Stock insuffisant! Disponible: ${demande.quantite}, Requis: ${newBS.nb_sortie}`,
      "error",
    );
    return;
  }

  const handleEditBS = (bs) => {
    dispatch(clearError());
    setEditBS(bs);

    let typeValue = "custom";

    // Déterminer le type basé sur la valeur
    if (!bs.reste_livrer || bs.reste_livrer === "") {
      typeValue = "solde";
    } else if (bs.reste_livrer === "0") {
      typeValue = "0";
    } else if (bs.reste_livrer === "-") {
      typeValue = "-";
    } else {
      // Vérifier si c'est une valeur calculée automatiquement
      const demande = demandes.find((d) => d.id_demande === bs.id_demande);
      const calculatedValue = demande
        ? Number(demande.qte_stock || 0) - Number(demande.quantite || 0)
        : 0;
      if (String(calculatedValue) === String(bs.reste_livrer)) {
        typeValue = "solde";
      } else {
        typeValue = "custom";
      }
    }

    setNewBS({
      code_bs: bs.code_bs || "",
      id_demande: String(bs.id_demande || ""),
      date_sortie: bs.date_sortie || "",
      nb_sortie: String(bs.nb_sortie || ""),
      reste_livrer: bs.reste_livrer || "",
    });

    setResteType(typeValue);
    setModalOpen(true);
  };

  const handleUpdateBS = async () => {
    // Vérifier si le stock est suffisant
    const demande = demandes.find((d) => d.id_demande === newBS.id_demande);
    if (demande && Number(newBS.nb_sortie) > Number(demande.quantite)) {
      showMessage(
        `Stock insuffisant! Disponible: ${demande.quantite}, Requis: ${newBS.nb_sortie}`,
        "error",
      );
      return;
    }

    try {
      console.log("Envoi modification:", newBS);
      await dispatch(
        updateBonSortie({ id_bs: editBS.id_bs, ...newBS }),
      ).unwrap();
      setSuccessMessage("Bon de sortie modifié avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
      setModalOpen(false);
      setEditBS(null);
      setNewBS({
        code_bs: "",
        id_demande: "",
        date_sortie: "",
        nb_sortie: "",
        reste_livrer: "",
      });
      // Recharger les données
      dispatch(getBonSorties());
    } catch (err) {
      console.error("Erreur lors de la modification", err);
      setErrorMessage("Erreur lors de la modification");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const filteredBS = bonSorties.filter((bs) => {
    const term = searchTerm.toLowerCase();
    return (
      !term ||
      bs.code_bs?.toLowerCase().includes(term) ||
      bs.designation?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Gestion des Bons de Sortie
          </h1>
          <p className="text-gray-500 text-sm">Liste des bons de sortie</p>
        </div>
        {currentUser?.role === "admin" && (
          <button
            onClick={() => {
              dispatch(clearError());
              setModalOpen(true);
              setEditBS(null);
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            + Nouveau bon
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

      {/* FILTRE */}

      <div className="bg-white p-6 rounded-xl shadow flex justify-center gap-6 mb-6 flex-wrap">
        <div className="flex flex-col w-full max-w-md">
          <label className="text-sm font-semibold text-gray-600 mb-1 text-center">
            Rechercher
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par code ou matériel"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-3 py-2 text-center">#</th>
              <th className="px-3 py-2 text-center">Code BS</th>
              <th className="px-3 py-2 text-center">Matériel</th>
              <th className="px-3 py-2 text-center">Quantité livree</th>
              <th className="px-3 py-2 text-center">Reste EN STOCKS</th>
              <th className="px-3 py-2 text-center">Reste à livrer</th>
              <th className="px-3 py-2 text-center">Date liv</th>
              <th className="px-3 py-2 text-center">Qte Sortie</th>
              {currentUser?.role === "admin" && (
                <th className="px-3 py-2 text-center">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y text-sm">
            {filteredBS.length > 0 ? (
              filteredBS.map((bs, index) => (
                <tr key={bs.id_bs} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-center">{index + 1}</td>
                  <td className="px-3 py-2 text-center">{bs.code_bs}</td>
                  <td className="px-3 py-2 text-center">{bs.designation}</td>
                  <td className="px-3 py-2 text-center">{bs.quantite}</td>
                  <td className="px-3 py-2 text-center font-semibold">
                    {Number(bs.quantite) - Number(bs.nb_sortie) || 0}
                  </td>
                  <td className="px-3 py-2 text-center">{bs.reste_livrer}</td>
                  <td className="px-3 py-2 text-center">{bs.date_sortie}</td>
                  <td className="px-3 py-2 text-center">{bs.nb_sortie}</td>

                  {currentUser?.role === "admin" && (
                    <td className="px-3 py-2 text-center">
                      {idBSToDelete === bs.id_bs ? (
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
                            onClick={() => handleEditBS(bs)}
                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => showDeleteBar(bs.id_bs)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
                <td colSpan="8" className="text-center py-6 text-gray-400">
                  Aucun bon de sortie trouvé
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
              {editBS ? "Modifier bon" : "Nouveau bon"}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Code BS"
                value={newBS.code_bs}
                onChange={(e) =>
                  setNewBS({ ...newBS, code_bs: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <select
                value={newBS.id_demande}
                onChange={(e) => {
                  setNewBS({ ...newBS, id_demande: e.target.value });
                  // Recalculer si "solde" est sélectionné
                  if (resteType === "solde") {
                    const demande = demandes.find(
                      (d) => String(d.id_demande) === String(e.target.value),
                    );
                    const calculatedValue =
                      demande && newBS.nb_sortie
                        ? String(
                            Number(demande.qte_stock || 0) -
                              Number(newBS.nb_sortie),
                          )
                        : "0";
                    setNewBS((prev) => ({
                      ...prev,
                      reste_livrer: calculatedValue,
                    }));
                  }
                }}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Choisir une demande</option>
                {demandes?.map((d) => (
                  <option key={d.id_demande} value={String(d.id_demande)}>
                    {d.designation} - {d.username}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={newBS.date_sortie}
                onChange={(e) =>
                  setNewBS({ ...newBS, date_sortie: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <input
                type="number"
                placeholder="Qte sortie"
                value={newBS.nb_sortie}
                onChange={(e) => {
                  setNewBS({ ...newBS, nb_sortie: e.target.value });
                  // Recalculer si "solde" est sélectionné
                  if (resteType === "solde") {
                    const demande = demandes.find(
                      (d) => String(d.id_demande) === String(newBS.id_demande),
                    );
                    const calculatedValue =
                      demande && e.target.value
                        ? String(
                            Number(demande.qte_stock || 0) -
                              Number(e.target.value),
                          )
                        : "0";
                    setNewBS((prev) => ({
                      ...prev,
                      reste_livrer: calculatedValue,
                    }));
                  }
                }}
                className="w-full border px-3 py-2 rounded"
              />

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Reste à livrer
                </label>
                <select
                  value={resteType}
                  onChange={(e) => {
                    setResteType(e.target.value);
                    if (e.target.value === "solde") {
                      // Calculer automatiquement: qte_stock - nb_sortie
                      const demande = demandes.find(
                        (d) =>
                          String(d.id_demande) === String(newBS.id_demande),
                      );
                      const calculatedValue =
                        demande && newBS.id_demande
                          ? String(
                              Number(demande.qte_stock || 0) -
                                Number(demande.quantite || 0),
                            )
                          : "0";
                      setNewBS({ ...newBS, reste_livrer: calculatedValue });
                    } else if (e.target.value === "0") {
                      setNewBS({ ...newBS, reste_livrer: "0" });
                    } else if (e.target.value === "-") {
                      setNewBS({ ...newBS, reste_livrer: "-" });
                    }
                  }}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="solde">Solde</option>
                  <option value="0">0</option>
                </select>
                {resteType === "solde" && newBS.reste_livrer && (
                  <p className="text-sm text-gray-500 mt-1">
                    Valeur calculée:{" "}
                    <span className="font-bold text-green-600">
                      {newBS.reste_livrer}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Annuler
              </button>
              <button
                onClick={editBS ? handleUpdateBS : handleAddBS}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {editBS ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BonSortie;
