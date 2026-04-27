import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/users/thunks/updateUserThunk";

const Settings = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        username: "",
        password: ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullname: user.full_name,
                email: user.email,
                username: user.username,
                password: ""
            });
        }
    }, [user]);

    const handleUpdate = async () => {
        if (!formData.fullname || !formData.email || !formData.username) {
            alert("Tous les champs sont obligatoires.");
            return;
        }

        try {
            setLoading(true);
            await dispatch(updateUser({
                id_user: user.id_user,
                fullname: formData.fullname,
                email: formData.email,
                username: formData.username,
                password: formData.password
            })).unwrap();

            setModalOpen(false);
        } catch {
            alert("Erreur lors de la mise à jour.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-10 flex flex-col items-center">

            <h1 className="text-3xl font-bold text-gray-800 mb-8">Profil Administratif</h1>

            {/* CARD PROFIL */}
            <div className="bg-white shadow-md rounded-xl w-full max-w-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* AVATAR */}
                <div className="flex flex-col items-center md:col-span-1">
                    <img
                        src={user?.profile_photo}
                        alt="avatar"
                        className="w-28 h-28 rounded-full border-2 border-gray-300 object-cover mb-4"
                    />
                    <h2 className="text-xl font-semibold text-gray-800">{user?.full_name}</h2>
                    <p className="text-gray-500">{user?.role}</p>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Modifier
                    </button>
                </div>

                {/* INFORMATIONS */}
                <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg shadow-inner flex flex-col justify-between">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Informations du compte</h3>
                    <div className="space-y-3 text-gray-700">
                        <div className="flex justify-between">
                            <span className="font-medium">Nom complet :</span>
                            <span>{user?.full_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Email :</span>
                            <span>{user?.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Username :</span>
                            <span>{user?.username}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Rôle :</span>
                            <span>{user?.role}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">

                        <h2 className="text-2xl font-bold text-gray-800 mb-5">Modifier les informations</h2>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nom complet"
                                value={formData.fullname}
                                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="password"
                                placeholder="Nouveau mot de passe (optionnel)"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleUpdate}
                                className={`px-4 py-2 rounded text-white font-semibold ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                disabled={loading}
                            >
                                {loading ? "Mise à jour..." : "Modifier"}
                            </button>
                        </div>

                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                            onClick={() => setModalOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;