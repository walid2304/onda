import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/users/thunks/logoutThunk";
import { useNavigate } from "react-router-dom";
import { FaProjectDiagram } from "react-icons/fa"; // Icon gestion + notifications

const MiniNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
      <div
        className="flex items-center gap-2 cursor-pointer text-blue-600"
        onClick={() => navigate("/dashboard")}
      >
        <FaProjectDiagram className="w-10 h-10" />
        <span className="text-xl font-bold text-gray-800">StockOnda</span>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="relative" ref={dropdownRef}>
            <img
              src={
                user.profile_photo || "https://ui-avatars.com/api/?name=User"
              }
              alt="avatar"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border rounded shadow-lg z-50">
                <button
                  onClick={() => navigate("/settings")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  Paramètres
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 flex items-center gap-2"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default MiniNavbar;
