import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getDemandes } from "../redux/demande/thunks/getDemandesThunks";
import { createDemande } from "../redux/demande/thunks/createDemandeThunks";
import { updateDemande } from "../redux/demande/thunks/updateDemandeThunks";
import { deleteDemande } from "../redux/demande/thunks/deleteDemandeThunks";

import { getMateriels } from "../redux/materiel/thunks/getMaterielsThunk";
import Pagination from "../pagination/Pagination";

const Demande = () => {
  const dispatch = useDispatch();

  const {
    demandes = [],
    loading,
    error,
  } = useSelector((state) => state.demande);
  const { materiels = [] } = useSelector((state) => state.materiel);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);

  const [newDemande, setNewDemande] = useState({
    id_materiel: "",
    quantite: "",
    reste_livrer: "0",
  });

  const [editDemande, setEditDemande] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [idDEToDelete, setIdDEToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(getDemandes());
    dispatch(getMateriels());
  }, [dispatch]);

  const closeModal = () => {
    setModalOpen(false);
    setEditDemande(null);

    setNewDemande({
      id_materiel: "",
      quantite: "",
      reste_livrer: "0",
    });
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
    setIdDEToDelete(id);
  };

  const cancelDelete = () => {
    setIdDEToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteDemande(idDEToDelete)).unwrap();
      showMessage("Demande supprimée avec succès", "success");
      dispatch(getDemandes());
      setIdDEToDelete(null);
    } catch (err) {
      showMessage(
        err || "Erreur lors de la suppression de la demande",
        "error",
      );
      setIdDEToDelete(null);
    }
  };

  const handleAddDemande = async () => {
    if (!newDemande.id_materiel || !newDemande.quantite) {
      showMessage("Tous les champs sont obligatoires", "error");
      return;
    }

    try {
      await dispatch(
        createDemande({
          ...newDemande,
          id_user: currentUser.id_user,
        }),
      ).unwrap();

      // Recharger la liste complète
      await dispatch(getDemandes()).unwrap();

      setSuccessMessage("Demande ajoutée avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
      setModalOpen(false);
      setNewDemande({
        id_materiel: "",
        quantite: "",
        reste_livrer: "0",
      });
    } catch (err) {
      console.error("Erreur lors de l'ajout", err);
      setErrorMessage("Erreur lors de l'ajout");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleEditDemande = (demande) => {
    setEditDemande(demande);

    setNewDemande({
      id_materiel: String(demande.id_materiel || ""),
      quantite: String(demande.quantite || ""),
      reste_livrer: String(demande.reste_livrer || ""),
    });

    setModalOpen(true);
  };

  const handleUpdateDemande = async () => {
    if (!newDemande.id_materiel || !newDemande.quantite) {
      showMessage("Tous les champs sont obligatoires", "error");
      return;
    }
    try {
      await dispatch(
        updateDemande({
          ...newDemande,
          id_demande: editDemande.id_demande,
        }),
      ).unwrap();
      setSuccessMessage("Demande modifiée avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
      setModalOpen(false);
      setEditDemande(null);
      setNewDemande({
        id_materiel: "",
        quantite: "",
        reste_livrer: "",
      });
      dispatch(getDemandes());
    } catch (err) {
      console.error("Erreur lors de la modification", err);
      setErrorMessage("Erreur lors de la modification");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleAcceptDemande = async (demande) => {
    await dispatch(
      updateDemande({
        id_demande: demande.id_demande,
        id_materiel: demande.id_materiel,
        quantite: demande.quantite,
        reste_livrer: demande.reste_livrer,
        statut: "acceptee",
        date_reception:
          demande.date_reception || new Date().toISOString().split("T")[0],
      }),
    ).unwrap();
    showMessage("Demande acceptée", "success");
    dispatch(getDemandes());
  };

  const handleRefuseDemande = async (demande) => {
    await dispatch(
      updateDemande({
        id_demande: demande.id_demande,
        id_materiel: demande.id_materiel,
        quantite: demande.quantite,
        reste_livrer: demande.reste_livrer,
        statut: "refusee",
      }),
    ).unwrap();
    showMessage("Demande refusée", "success");
    dispatch(getDemandes());
  };

  const filteredDE = demandes
    .filter((d) => d && d.id_demande)
    .filter((d) => {
      const term = searchTerm.toLowerCase();
      return (
        !term ||
        d.designation?.toLowerCase().includes(term) ||
        d.statut?.toLowerCase().includes(term)
      );
    });

  const displayedDE = filteredDE.slice((page - 1) * limit, page * limit);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Gestion des demandes
          </h1>

          <p className="text-gray-500 text-sm">Demandes de matériel</p>
        </div>
        {currentUser?.role === "admin" && (
          <button
            onClick={() => {
              setModalOpen(true);
              setEditDemande(null);
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            + Nouvelle demande
          </button>
        )}
      </div>

      {/* BARRE STATISTIQUES ACCEPTATION */}
      {demandes.length > 0 && (
        <div className="mb-6 bg-white rounded-xl shadow p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Statistiques des demandes
          </h3>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-2">Acceptées</p>
              <p className="text-2xl font-bold text-green-600">
                {demandes.filter((d) => d && d.statut === "acceptee").length}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-2">En attente</p>
              <p className="text-2xl font-bold text-gray-600">
                {demandes.filter((d) => d && d.statut === "en_attente").length}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-2">Refusées</p>
              <p className="text-2xl font-bold text-red-600">
                {demandes.filter((d) => d && d.statut === "refusee").length}
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 flex overflow-hidden">
            <div
              className="bg-green-500 h-full"
              style={{
                width: `${
                  demandes.length > 0
                    ? (demandes.filter((d) => d && d.statut === "acceptee")
                        .length /
                        demandes.length) *
                      100
                    : 0
                }%`,
              }}
            ></div>
            <div
              className="bg-gray-400 h-full"
              style={{
                width: `${
                  demandes.length > 0
                    ? (demandes.filter((d) => d && d.statut === "en_attente")
                        .length /
                        demandes.length) *
                      100
                    : 0
                }%`,
              }}
            ></div>
            <div
              className="bg-red-500 h-full"
              style={{
                width: `${
                  demandes.length > 0
                    ? (demandes.filter((d) => d && d.statut === "refusee")
                        .length /
                        demandes.length) *
                      100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
      )}

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
            placeholder="Rechercher par matériel ou statut"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3 text-center">#</th>
              <th className="px-6 py-3 text-center">Utilisateur</th>
              <th className="px-6 py-3 text-center">Matériel</th>
              <th className="px-6 py-3 text-center">Quantité livrée</th>
              <th className="px-6 py-3 text-center">Date demande</th>
              {currentUser?.role === "admin" && (
                <th className="px-6 py-3 text-center">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y">
            {displayedDE.length > 0 ? (
              displayedDE.map((d, index) => (
                <tr key={d.id_demande} className="hover:bg-gray-50">
                  <td className="px-3 py-4 text-center">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="px-6 py-4 text-center">{d.username}</td>
                  <td className="px-6 py-4 text-center">{d.designation}</td>
                  <td className="px-6 py-4 text-center">{d.quantite}</td>
                  <td className="px-6 py-4 text-center">{d.date_demande}</td>
                  {currentUser?.role === "admin" && (
                    <td className="px-3 py-2 text-center">
                      {idDEToDelete === d.id_demande ? (
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
                        <div className="flex flex-col sm:flex-row justify-center gap-2">
                          {d.statut === "en_attente" && (
                            <>
                              <button
                                onClick={() => handleAcceptDemande(d)}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                              >
                                Accepter
                              </button>
                              <button
                                onClick={() => handleRefuseDemande(d)}
                                className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                              >
                                Refuser
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleEditDemande(d)}
                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => showDeleteBar(d.id_demande)}
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
                <td colSpan="6" className="text-center py-10 text-gray-400">
                  Aucune demande trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          page={page}
          setPage={setPage}
          totalItems={filteredDE.length}
          limit={limit}
        />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              {editDemande ? "Modifier demande" : "Nouvelle demande"}
            </h2>

            <div className="space-y-3">
              <select
                value={newDemande.id_materiel}
                onChange={(e) =>
                  setNewDemande({
                    ...newDemande,
                    id_materiel: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Choisir matériel</option>

                {materiels?.map((m) => (
                  <option key={m.id_materiel} value={String(m.id_materiel)}>
                    {m.designation}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Quantité"
                value={newDemande.quantite}
                onChange={(e) =>
                  setNewDemande({
                    ...newDemande,
                    quantite: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Annuler
              </button>

              <button
                onClick={editDemande ? handleUpdateDemande : handleAddDemande}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {editDemande ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Demande;
