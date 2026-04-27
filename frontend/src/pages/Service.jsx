import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getServices } from "../redux/service/thunks/getServicesThunk";
import { addService } from "../redux/service/thunks/addServiceThunk";
import { updateService } from "../redux/service/thunks/updateServiceThunk";
import { deleteService } from "../redux/service/thunks/deleteServiceThunk";

const Service = () => {
  const dispatch = useDispatch();

  const { services, loading, error } = useSelector((state) => state.service);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);

  const [newService, setNewService] = useState({
    nom_service: "",
    description: "",
  });

  const [editService, setEditService] = useState(null);
  const [idservice, setidservice] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const showDeleteBar = (id) => {
    setidservice(id);
  };

  const cancelDelete = () => {
    setidservice(null);
  };

  const confirmDelete = async (id) => {
    try {
      await dispatch(deleteService(id)).unwrap();
      setSuccessMessage("Service supprimé avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
      setErrorMessage("Erreur lors de la suppression");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setidservice(null);
    }
  };

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  const closeModal = () => {
    setModalOpen(false);
    setEditService(null);
    setNewService({
      nom_service: "",
      description: "",
    });
  };

  const handleAddService = async () => {
    if (!newService.nom_service.trim()) {
      alert("Le nom du service est obligatoire");
      return;
    }
    try {
      await dispatch(addService(newService)).unwrap();
      setSuccessMessage("Service ajouté avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
      closeModal();
    } catch (err) {
      console.error("Erreur lors de l'ajout", err);
      setErrorMessage("Erreur lors de l'ajout");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleEditService = (service) => {
    setEditService(service);

    setNewService({
      nom_service: service.nom_service,
      description: service.description || "",
    });

    setModalOpen(true);
  };

  const handleUpdateService = async () => {
    if (!newService.nom_service.trim()) {
      alert("Le nom du service est obligatoire");
      return;
    }
    try {
      await dispatch(
        updateService({
          id_service: editService.id_service,
          nom_service: newService.nom_service,
          description: newService.description,
        }),
      ).unwrap();
      setSuccessMessage("Service modifié avec succès");
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
            Gestion des services
          </h1>

          <p className="text-gray-500 text-sm">
            Administration des services internes
          </p>
        </div>

        {currentUser?.role === "admin" && (
          <button
            onClick={() => {
              setModalOpen(true);
              setEditService(null);
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Nouveau service
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
              <th className="px-6 py-3 text-center">Nom du service</th>
              <th className="px-6 py-3 text-center">Description</th>
              {currentUser?.role === "admin" && (
                <th className="px-6 py-3 text-center">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y">
            {services.map((s, index) => (
              <tr key={s.id_service} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-center">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-gray-800 text-center">
                  {s.nom_service}
                </td>
                <td className="px-6 py-4 text-gray-600 text-center">
                  {s.description || "-"}
                </td>
                {currentUser?.role === "admin" && (
                  <td className="px-6 py-4 text-center space-x-2">
                    {idservice === s.id_service ? (
                      <div className="flex justify-center gap-2 bg-red-100 px-2 rounded">
                        <button
                          onClick={() => confirmDelete(s.id_service)}
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
                          onClick={() => handleEditService(s)}
                          className="px-3 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => showDeleteBar(s.id_service)}
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

            {services.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400">
                  Aucun service trouvé
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
              {editService ? "Modifier service" : "Ajouter service"}
            </h2>

            <div className="space-y-3">
              <input
                placeholder="Nom du service"
                value={newService.nom_service}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    nom_service: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                placeholder="Description"
                value={newService.description}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    description: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
                rows="3"
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
                onClick={editService ? handleUpdateService : handleAddService}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editService ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Service;
