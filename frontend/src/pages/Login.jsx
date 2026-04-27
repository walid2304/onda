import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/users/thunks/loginThunk";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ username, password })).unwrap();
      if (result.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-end bg-cover bg-center px-6"
      style={{
        backgroundImage:
          "url('/managers-visiting-storage-center-discussing-about-distribution-goals-year.jpg')",
      }}
    >
      <div className="hidden lg:flex flex-col justify-center w-full max-w-lg mr-8 bg-white/35 backdrop-blur-lg p-8 rounded-3xl text-black border border-white/10">
        <h2 className="text-3xl font-bold mb-4">
          Bienvenue sur la gestion de stock
        </h2>
        <p className="tblock mb-1 font-medium text-black">
          Connectez-vous pour suivre vos mouvements, gérer les demandes et
          contrôler l'inventaire en temps réel. L'interface est conçue pour vous
          apporter une vue claire et des actions rapides.
        </p>
        <p className="block mb-1 font-medium text-black">
          Si vous n'avez pas encore de compte, contactez un administrateur pour
          obtenir vos identifiants.
        </p>
      </div>

      <div className="w-[90%] max-w-md bg-white/35 backdrop-blur-lg p-10 rounded-3xl text-white border border-white/15">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Connexion
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-black">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Votre nom d'utilisateur"
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-black">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
