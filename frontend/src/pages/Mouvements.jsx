import { getJustificatifsThunk } from "../redux/justif/thunks/getJustificatifsThunk";
import { uploadJustificatifThunk } from "../redux/justif/thunks/uploadJustificatifThunk";
import { deleteJustificatifThunk } from "../redux/justif/thunks/deleteJustificatifThunk";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getMouvements } from "../redux/mouvements/thunks/getMouvementsThunks";
import { addMouvement } from "../redux/mouvements/thunks/addMouvementThunks";
import { updateMouvement } from "../redux/mouvements/thunks/updateMouvementsThunks";
import { deleteMouvement } from "../redux/mouvements/thunks/deleteMouvementThunks";
import { getMaterielsES } from "../redux/materiel/thunks/getMaterielESThunks";
import { getAffectations } from "../redux/affectation/thunks/getAffectationsThunk";
import { getBonSorties } from "../redux/bon_sortie/thunks/getBonSortieThunks";
import Pagination from "../pagination/Pagination";

const Mouvements = () => {
  const dispatch = useDispatch();
  const { mouvements, loading, error } = useSelector(
    (state) => state.mouvements,
  );
  const { materiels } = useSelector((state) => state.materiel);
  const { affectations } = useSelector((state) => state.affectation);
  const { bonSorties } = useSelector((state) => state.bonSortie);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMouvement, setEditMouvement] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [idMouvementToDelete, setIdMouvementToDelete] = useState(null);
  const [newMouvement, setNewMouvement] = useState({
    id_materiel: "",
    id_affe: "",
    id_bs: "",
    quantite: "",
    date_mouvement: "",
  });

  const [filter, setFilter] = useState({
    materiel: "",
    affectation: "",
    type: "",
    bs: "",
  });
  const [page, setPage] = useState(1);
  const limit = 10;

  const getBonSortieQuantity = (id_bs) => {
    const bs = bonSorties.find((b) => String(b.id_bs) === String(id_bs));
    return bs ? bs.nb_sortie : "";
  };

  const selectedBonSortieQuantity = getBonSortieQuantity(newMouvement.id_bs);

  // États pour la gestion des justificatifs par mouvement
  const [justificatifModalOpen, setJustificatifModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [currentMouvement, setCurrentMouvement] = useState(null);
  const [currentMouvementJustificatifs, setCurrentMouvementJustificatifs] =
    useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(getMouvements());
    dispatch(getMaterielsES());
    dispatch(getAffectations());
    dispatch(getBonSorties());
  }, [dispatch]);

  const resetForm = () =>
    setNewMouvement({
      id_materiel: "",
      id_affe: "",
      id_bs: "",
      quantite: "",
      date_mouvement: "",
    });

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
    setIdMouvementToDelete(id);
  };

  const cancelDelete = () => {
    setIdMouvementToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteMouvement(idMouvementToDelete)).unwrap();
      showMessage("Mouvement supprimé avec succès");
      dispatch(getMouvements());
      setIdMouvementToDelete(null);
    } catch (err) {
      showMessage("Erreur lors de la suppression", "error");
      setIdMouvementToDelete(null);
    }
  };

  const handleError = (err) => {
    let message = "Une erreur est survenue";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    showMessage(message, "error");
    console.error("Erreur :", err);
  };

  const handleAddMouvement = async (type_mouvement) => {
    if (!newMouvement.id_materiel || !newMouvement.quantite) {
      showMessage("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }

    try {
      const result = await dispatch(
        addMouvement({
          ...newMouvement,
          type_mouvement,
          id_materiel: Number(newMouvement.id_materiel),
          id_affe: newMouvement.id_affe ? Number(newMouvement.id_affe) : null,
          id_bs: newMouvement.id_bs ? Number(newMouvement.id_bs) : null,
          quantite: Number(newMouvement.quantite),
          date_mouvement:
            newMouvement.date_mouvement ||
            new Date().toISOString().split("T")[0],
        }),
      ).unwrap();

      // Si des fichiers sont sélectionnés, les uploader pour ce mouvement
      let uploadError = false;
      if (selectedFiles.length > 0) {
        try {
          for (const file of selectedFiles) {
            await dispatch(
              uploadJustificatifThunk({
                id_mouvement: result.id_mouv,
                fichier: file,
              }),
            ).unwrap();
          }
        } catch (uploadErr) {
          uploadError = true;
          handleError(uploadErr);
        }
      }

      if (!uploadError) {
        await dispatch(getMouvements()).unwrap();
        setModalOpen(false);
        resetForm();
        setSelectedFiles([]);
        showMessage("Mouvement ajouté avec succès");
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleEditMouvement = (m) => {
    setEditMouvement(m);
    setNewMouvement({
      id_materiel: String(m.id_materiel),
      id_affe: m.id_affe ? String(m.id_affe) : "",
      id_bs: m.id_bs ? String(m.id_bs) : "",
      quantite: m.quantite,
      date_mouvement: m.date_mouvement,
    });
    setSelectedFiles([]);
    setModalOpen(true);
    // Charger les justificatifs du mouvement en cours d'édition
    if (m.justificatifs && m.justificatifs.length > 0) {
      setCurrentMouvementJustificatifs(m.justificatifs);
    } else {
      setCurrentMouvementJustificatifs([]);
    }
  };

  const handleUpdateMouvement = async () => {
    try {
      await dispatch(
        updateMouvement({
          id_mouv: editMouvement.id_mouv,
          id_materiel: Number(newMouvement.id_materiel),
          id_affe: newMouvement.id_affe ? Number(newMouvement.id_affe) : null,
          id_bs: newMouvement.id_bs ? Number(newMouvement.id_bs) : null,
          quantite: Number(newMouvement.quantite),
          date_mouvement:
            newMouvement.date_mouvement ||
            editMouvement.date_mouvement ||
            new Date().toISOString().split("T")[0],
          type_mouvement: editMouvement.type_mouvement,
        }),
      ).unwrap();

      // Si de nouveaux fichiers sont sélectionnés, les uploader pour ce mouvement
      let uploadError = false;
      if (selectedFiles.length > 0) {
        try {
          for (const file of selectedFiles) {
            await dispatch(
              uploadJustificatifThunk({
                id_mouvement: editMouvement.id_mouv,
                fichier: file,
              }),
            ).unwrap();
          }
        } catch (uploadErr) {
          uploadError = true;
          handleError(uploadErr);
        }
      }

      if (!uploadError) {
        await dispatch(getMouvements()).unwrap();
        setModalOpen(false);
        setEditMouvement(null);
        resetForm();
        setSelectedFiles([]);
        setCurrentMouvementJustificatifs([]);
        showMessage("Mouvement modifié avec succès");
      }
    } catch (err) {
      handleError(err);
    }
  };

  // Gestion des fichiers sélectionnés
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload des justificatifs pour un mouvement spécifique
  const handleUploadJustificatifs = async (id_mouv, files) => {
    if (files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        await dispatch(
          uploadJustificatifThunk({
            id_mouvement: id_mouv,
            fichier: file,
          }),
        ).unwrap();
      }

      // Recharger les justificatifs pour ce mouvement
      const justifs = await dispatch(getJustificatifsThunk(id_mouv)).unwrap();

      setCurrentMouvementJustificatifs(justifs);

      // Recharger les mouvements pour mettre à jour la liste
      dispatch(getMouvements());
    } catch (err) {
      handleError(err);
    } finally {
      setUploading(false);
      setSelectedFiles([]);
    }
  };

  // Suppression d'un justificatif pour un mouvement spécifique
  const handleDeleteJustificatif = async (id_justificatif, id_mouv) => {
    try {
      await dispatch(deleteJustificatifThunk(id_justificatif)).unwrap();

      // Mettre à jour la liste des justificatifs du mouvement en cours
      setCurrentMouvementJustificatifs((prev) =>
        prev.filter((j) => j.id_justificatif !== id_justificatif),
      );

      // Recharger les mouvements pour mettre à jour le compteur
      dispatch(getMouvements());
    } catch (err) {
      handleError(err);
    }
  };

  // Ouvrir le modal des justificatifs pour un mouvement spécifique
  const openJustificatifModal = (mouvement) => {
    setCurrentMouvement(mouvement);
    setCurrentMouvementJustificatifs(mouvement.justificatifs || []);
    setJustificatifModalOpen(true);
  };

  // Upload depuis le modal dédié
  const handleUploadFromModal = async () => {
    if (selectedFiles.length === 0) {
      alert("Veuillez sélectionner des fichiers");
      return;
    }

    await handleUploadJustificatifs(currentMouvement.id_mouv, selectedFiles);
    setUploadModalOpen(false);
  };

  const filteredMouvements = mouvements.filter(
    (m) =>
      (filter.materiel ? String(m.id_materiel) === filter.materiel : true) &&
      (filter.affectation ? String(m.id_affe) === filter.affectation : true) &&
      (filter.type ? m.type_mouvement === filter.type : true) &&
      (filter.bs ? String(m.id_bs) === filter.bs : true),
  );

  const displayedMouvements = filteredMouvements.slice(
    (page - 1) * limit,
    page * limit,
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mouvements</h1>
          <p className="text-gray-500 text-sm">
            Suivi des affectations et retours du matériel
          </p>
        </div>
        {currentUser?.role === "admin" && (
          <button
            onClick={() => {
              setModalOpen(true);
              setEditMouvement(null);
              resetForm();
              setSelectedFiles([]);
              setCurrentMouvementJustificatifs([]);
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Nouveau mouvement
          </button>
        )}
      </div>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4 border border-green-400 shadow-md animate-pulse">
          ✓ {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 border border-red-400 shadow-md animate-pulse">
          ✗ {errorMessage}
        </div>
      )}

      {/* FILTERS */}
      <div className="bg-white p-6 rounded-xl shadow flex justify-center gap-6 mb-6 flex-wrap">
        {/* Matériel */}
        <div className="flex flex-col w-56">
          <label className="text-sm font-semibold text-gray-600 mb-1 text-center">
            Matériel
          </label>
          <select
            value={filter.materiel}
            onChange={(e) => setFilter({ ...filter, materiel: e.target.value })}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous matériels</option>
            {materiels.map((m) => (
              <option key={m.id_materiel} value={m.id_materiel}>
                {m.designation}
              </option>
            ))}
          </select>
        </div>

        {/* Affectation */}
        <div className="flex flex-col w-56">
          <label className="text-sm font-semibold text-gray-600 mb-1 text-center">
            Affectation
          </label>
          <select
            value={filter.affectation}
            onChange={(e) =>
              setFilter({ ...filter, affectation: e.target.value })
            }
            className="px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes affectations</option>
            {affectations.map((a) => (
              <option key={a.id_affe} value={a.id_affe}>
                {a.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Bon de sortie */}
        <div className="flex flex-col w-56">
          <label className="text-sm font-semibold text-gray-600 mb-1 text-center">
            Bon de sortie
          </label>
          <select
            value={filter.bs}
            onChange={(e) => setFilter({ ...filter, bs: e.target.value })}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous BS</option>
            {bonSorties.map((b) => (
              <option key={b.id_bs} value={b.id_bs}>
                {b.numero || `BS #${b.code_bs}`}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div className="flex flex-col w-56">
          <label className="text-sm font-semibold text-gray-600 mb-1 text-center">
            Type
          </label>
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous types</option>
            <option value="affectation">Affectation</option>
            <option value="retour">Retour</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      {loading && <div className="text-center py-10">Chargement...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3 text-center">#</th>
              <th className="px-6 py-3 text-center">Matériel</th>
              <th className="px-6 py-3 text-center">Affectation</th>
              <th className="px-6 py-3 text-center">Bon de sortie</th>
              <th className="px-6 py-3 text-center">Qte Sortie</th>
              <th className="px-6 py-3 text-center">Type</th>
              <th className="px-6 py-3 text-center">Date</th>
              <th className="px-6 py-3 text-center">Justificatifs</th>
              {currentUser?.role === "admin" && (
                <th className="px-6 py-3 text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {displayedMouvements.map((m, index) => (
              <tr key={m.id_mouv} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-center">
                  {(page - 1) * limit + index + 1}
                </td>
                <td className="px-6 py-4 text-center">
                  {m.designation || "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  {m.affectation || "-"}
                </td>
                <td className="px-6 py-4 text-center">{m.bs_numero || "-"}</td>
                <td className="px-6 py-4 font-medium text-center">
                  {m.quantite}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      m.type_mouvement === "affectation"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {m.type_mouvement}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-center">
                  {m.date_mouvement}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    {m.justificatifs && m.justificatifs.length > 0 ? (
                      <button
                        onClick={() => openJustificatifModal(m)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 w-full"
                      >
                        Voir ({m.justificatifs.length})
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">Aucun</span>
                    )}
                  </div>
                </td>
                {currentUser?.role === "admin" && (
                  <td className="px-6 py-4 text-center space-x-2">
                    {idMouvementToDelete === m.id_mouv ? (
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
                          onClick={() => handleEditMouvement(m)}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => showDeleteBar(m.id_mouv)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL AJOUT / MODIF */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editMouvement ? "Modifier mouvement" : "Ajouter mouvement"}
            </h3>

            {/* FORMULAIRE */}
            <select
              value={newMouvement.id_materiel}
              onChange={(e) =>
                setNewMouvement({
                  ...newMouvement,
                  id_materiel: e.target.value,
                })
              }
              className="border w-full p-2 mb-2 rounded"
            >
              <option value="">-- Choisir matériel --</option>
              {materiels.map((m) => (
                <option key={m.id_materiel} value={m.id_materiel}>
                  {m.designation}
                </option>
              ))}
            </select>

            <select
              value={newMouvement.id_affe}
              onChange={(e) =>
                setNewMouvement({ ...newMouvement, id_affe: e.target.value })
              }
              className="border w-full p-2 mb-2 rounded"
            >
              <option value="">-- Choisir affectation --</option>
              {affectations.map((a) => (
                <option key={a.id_affe} value={a.id_affe}>
                  {a.nom}
                </option>
              ))}
            </select>

            <select
              value={newMouvement.id_bs}
              onChange={(e) => {
                const id_bs = e.target.value;
                const quantity = getBonSortieQuantity(id_bs);
                setNewMouvement({
                  ...newMouvement,
                  id_bs,
                  quantite: quantity,
                });
              }}
              className="border w-full p-2 mb-2 rounded"
            >
              <option value="">-- Choisir bon de sortie --</option>
              {bonSorties.map((b) => (
                <option key={b.id_bs} value={b.id_bs}>
                  {b.numero || `BS #${b.code_bs}`}
                </option>
              ))}
            </select>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantité (auto)
              </label>
              <input
                type="text"
                value={
                  selectedBonSortieQuantity || "Sélectionnez un bon de sortie"
                }
                readOnly
                className="border w-full p-2 mb-2 rounded bg-gray-100 text-gray-700"
              />
            </div>

            {/* SECTION UPLOAD JUSTIFICATIFS */}
            <div className="mb-4 border-t pt-4">
              <h4 className="font-semibold mb-2">Justificatifs</h4>

              {/* Affichage des justificatifs existants en mode édition */}
              {editMouvement && currentMouvementJustificatifs.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">
                    Justificatifs existants :
                  </p>
                  <ul className="space-y-1">
                    {currentMouvementJustificatifs.map((j) => (
                      <li
                        key={j.id_justificatif}
                        className="flex items-center justify-between text-sm bg-gray-50 p-1 rounded"
                      >
                        <span className="truncate flex-1">{j.nom_fichier}</span>
                        <div className="flex gap-1">
                          <a
                            href={j.download_url}
                            download
                            className="text-blue-500 hover:text-blue-700 px-2"
                          >
                            📥
                          </a>
                          <button
                            onClick={() =>
                              handleDeleteJustificatif(
                                j.id_justificatif,
                                editMouvement.id_mouv,
                              )
                            }
                            className="text-red-500 hover:text-red-700 px-2"
                          >
                            🗑️
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Upload de nouveaux fichiers */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ajouter des justificatifs
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="w-full text-sm border rounded p-1"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </div>

              {/* Liste des fichiers sélectionnés */}
              {selectedFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">
                    Fichiers sélectionnés :
                  </p>
                  <ul className="space-y-1">
                    {selectedFiles.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between text-sm bg-blue-50 p-1 rounded"
                      >
                        <span className="truncate flex-1">{file.name}</span>
                        <button
                          onClick={() => removeSelectedFile(index)}
                          className="text-red-500 hover:text-red-700 px-2"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {!editMouvement ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddMouvement("affectation")}
                  className="bg-blue-600 text-white px-4 py-2 rounded flex-1 hover:bg-blue-700"
                  disabled={uploading}
                >
                  {uploading ? "Upload..." : "Affectation"}
                </button>
                <button
                  onClick={() => handleAddMouvement("retour")}
                  className="bg-green-600 text-white px-4 py-2 rounded flex-1 hover:bg-green-700"
                  disabled={uploading}
                >
                  {uploading ? "Upload..." : "Retour"}
                </button>
              </div>
            ) : (
              <button
                onClick={handleUpdateMouvement}
                className="bg-gray-500 text-white px-4 py-2 rounded w-full mb-2 hover:bg-gray-600"
                disabled={uploading}
              >
                {uploading
                  ? "Upload en cours..."
                  : "Enregistrer les modifications"}
              </button>
            )}

            <button
              onClick={() => {
                setModalOpen(false);
                resetForm();
                setEditMouvement(null);
                setSelectedFiles([]);
                setCurrentMouvementJustificatifs([]);
              }}
              className="mt-2 w-full bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* MODAL JUSTIFICATIFS */}
      {justificatifModalOpen && currentMouvement && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              Justificatifs - Mouvement #{currentMouvement.id_mouv}
            </h3>
            {currentMouvementJustificatifs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Aucun justificatif pour ce mouvement
              </p>
            ) : (
              <ul className="space-y-3">
                {currentMouvementJustificatifs.map((j) => (
                  <li
                    key={j.id_justificatif}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{j.nom_fichier}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(j.date_upload).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`http://localhost/gestion_stock-onda-2fd7d866fcd83965731011b3115bc0186dd89b16/backend/serve-file.php?file=${j.chemin_fichier}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                        download={j.nom_fichier}
                      >
                        Télécharger
                      </a>
                      {currentUser?.role === "admin" && (
                        <button
                          onClick={() =>
                            handleDeleteJustificatif(
                              j.id_justificatif,
                              currentMouvement.id_mouv,
                            )
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setJustificatifModalOpen(false)}
                className="flex-1 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL UPLOAD DÉDIÉ */}
      {uploadModalOpen && currentMouvement && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">
              Ajouter des justificatifs - Mouvement #{currentMouvement.id_mouv}
            </h3>

            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="w-full text-sm border rounded p-2 mb-4"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />

            {selectedFiles.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">
                  Fichiers sélectionnés :
                </p>
                <ul className="space-y-1 max-h-40 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                    >
                      <span className="truncate flex-1">{file.name}</span>
                      <button
                        onClick={() => removeSelectedFile(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleUploadFromModal}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={selectedFiles.length === 0 || uploading}
              >
                {uploading ? "Upload..." : "Uploader"}
              </button>
              <button
                onClick={() => {
                  setUploadModalOpen(false);
                  setSelectedFiles([]);
                }}
                className="flex-1 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <Pagination
        page={page}
        setPage={setPage}
        totalItems={filteredMouvements.length}
        limit={limit}
      />
    </div>
  );
};

export default Mouvements;
