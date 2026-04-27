import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../redux/users/thunks/getUsersThunk";
import { deleteUser } from "../redux/users/thunks/deleteUserThunk";
import { changeRole } from "../redux/users/thunks/changeRoleThunk";
import { registerUser } from "../redux/users/thunks/registerThunk";
import { updateUser } from "../redux/users/thunks/updateUserThunk";

const Users = () => {
  const dispatch = useDispatch();

  const {
    users,
    loading,
    error,
    user: currentUser,
  } = useSelector((state) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [iduser, setiduser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [newUser, setNewUser] = useState({
    fullname: "",
    email: "",
    username: "",
    role: "user",
    password: "",
  });

  const showDeleteBar = (id) => {
    setiduser(id);
  };

  const cancelDelete = () => {
    setiduser(null);
  };

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  /* ---------------- DELETE ---------------- */

  const confirmDelete = async (id) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      setSuccessMessage("Utilisateur supprimé avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
      setErrorMessage("Erreur lors de la suppression");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setiduser(null);
    }
  };

  /* ---------------- ROLE ---------------- */

  const handleRoleChange = (id, role) => {
    dispatch(changeRole({ id_user: id, role }));
  };

  /* ---------------- ADD USER ---------------- */

  const handleAddUser = async () => {
    if (
      !newUser.fullname ||
      !newUser.email ||
      !newUser.username ||
      !newUser.password
    ) {
      setErrorMessage("Tous les champs sont obligatoires");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      await dispatch(registerUser(newUser)).unwrap();
      setSuccessMessage("Utilisateur ajouté avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
      setModalOpen(false);
      setNewUser({
        fullname: "",
        email: "",
        username: "",
        role: "user",
        password: "",
      });
      dispatch(getUsers());
    } catch (err) {
      console.error("Erreur lors de l'ajout", err);
      setErrorMessage("Erreur lors de l'ajout de l'utilisateur");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  /* ---------------- OPEN EDIT MODAL ---------------- */

  const handleEditUser = (user) => {
    setEditUser(user);

    setNewUser({
      fullname: user.full_name,
      email: user.email,
      username: user.username,
      role: user.role,
      password: "",
    });

    setModalOpen(true);
  };

  /* ---------------- UPDATE USER ---------------- */

  const handleUpdateUser = async () => {
    if (!newUser.fullname || !newUser.email || !newUser.username) {
      setErrorMessage("Tous les champs sont obligatoires");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      await dispatch(
        updateUser({
          id_user: editUser.id_user,
          full_name: newUser.fullname,
          email: newUser.email,
          username: newUser.username,
          role: newUser.role,
          password: newUser.password ? newUser.password : undefined,
        }),
      ).unwrap();
      setSuccessMessage("Utilisateur modifié avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
      setModalOpen(false);
      setEditUser(null);
      setNewUser({
        fullname: "",
        email: "",
        username: "",
        role: "user",
        password: "",
      });
      dispatch(getUsers());
    } catch (err) {
      console.error("Erreur lors de la mise à jour", err);
      setErrorMessage("Erreur lors de la mise à jour de l'utilisateur");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Gestion des utilisateurs
          </h1>

          <p className="text-gray-500 text-sm">
            Administrer les comptes utilisateurs
          </p>
        </div>

        {currentUser?.role === "admin" && (
          <button
            onClick={() => {
              setModalOpen(true);
              setEditUser(null);
              setNewUser({
                fullname: "",
                email: "",
                username: "",
                role: "user",
                password: "",
              });
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Nouvel utilisateur
          </button>
        )}
      </div>

      {/* LOADING */}

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
              <th className="px-6 py-3 text-center">Username</th>
              <th className="px-6 py-3 text-center">Rôle</th>

              {currentUser?.role === "admin" && (
                <th className="px-6 py-3 text-center">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.map((u, index) => (
              <tr key={u.id_user} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-center">{index + 1}</td>

                <td className="px-6 py-4 text-center">{u.full_name}</td>

                <td className="px-6 py-4 text-center">{u.email}</td>

                <td className="px-6 py-4 text-center">{u.username}</td>

                {/* ROLE */}

                <td className="px-6 py-4 text-center">
                  {currentUser?.role === "admin" &&
                  currentUser.id_user !== u.id_user ? (
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(u.id_user, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="user">User</option>

                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                                            ${
                                              u.role === "admin"
                                                ? "bg-blue-100 text-blue-600"
                                                : "bg-gray-200 text-gray-600"
                                            }`}
                    >
                      {u.role}
                    </span>
                  )}
                </td>

                {/* ACTIONS */}

                {currentUser?.role === "admin" &&
                  currentUser.id_user !== u.id_user && (
                    <td className="px-6 py-4 text-center space-x-2">
                      {iduser === u.id_user ? (
                        <div className="flex justify-center gap-2 bg-red-100 px-2 rounded">
                          <button
                            onClick={() => confirmDelete(u.id_user)}
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
                            onClick={() => handleEditUser(u)}
                            className="px-3 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
                          >
                            Modifier
                          </button>

                          <button
                            onClick={() => showDeleteBar(u.id_user)}
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
          </tbody>
        </table>
      </div>

      {/* MODAL */}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              {editUser ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nom complet"
                value={newUser.fullname}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    fullname: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    email: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    username: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <input
                type="password"
                placeholder="Mot de passe"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    password: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    role: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>

              <button
                onClick={editUser ? handleUpdateUser : handleAddUser}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editUser ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
