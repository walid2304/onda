import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserPlus,
  FaListAlt,
  FaBoxOpen,
  FaConciergeBell,
  FaExchangeAlt,
  FaClipboardCheck,
  FaRegCheckCircle,
  FaTools,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Utilisateur", path: "/users", icon: <FaUsers />, adminOnly: true },
    { name: "Fourniture", path: "/categorie", icon: <FaListAlt /> },
    { name: "Matériel", path: "/materiel", icon: <FaTools /> },
    { name: "Service", path: "/service", icon: <FaConciergeBell /> },
    { name: "Affectation", path: "/affectation", icon: <FaUserPlus /> },
    { name: "Stock", path: "/stock", icon: <FaBoxOpen /> },
    { name: "Mouvements", path: "/mouvements", icon: <FaExchangeAlt /> },
    { name: "Demande", path: "/demande", icon: <FaClipboardCheck /> },
    { name: "Bon sortie", path: "/bon-sortie", icon: <FaRegCheckCircle /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-gray-100 flex-shrink-0 h-screen shadow-lg">
      <div className="p-6 text-2xl font-bold border-b border-gray-700 flex items-center justify-center">
        <span>Menu</span>
      </div>

      <nav className="flex flex-col p-4 space-y-2">
        {links.map((link) => {
          if (link.adminOnly && currentUser?.role !== "admin") return null;

          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200
                                ${isActive ? "bg-gray-700 font-semibold shadow-inner" : "hover:translate-x-1"}`
              }
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
