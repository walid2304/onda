import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMouvements } from "../redux/mouvements/thunks/getMouvementsThunks";
import { getMateriels } from "../redux/materiel/thunks/getMaterielsThunk";
import { getAffectations } from "../redux/affectation/thunks/getAffectationsThunk";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { FaBox, FaUsers, FaExchangeAlt, FaCalendarAlt } from "react-icons/fa";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { mouvements } = useSelector((state) => state.mouvements);
  const { materiels } = useSelector((state) => state.materiel);
  const { affectations } = useSelector((state) => state.affectation);

  const [stats, setStats] = useState({
    totalMateriels: 0,
    totalAffectations: 0,
    totalMouvements: 0,
    mouvementsParMois: [],
    repartitionParFourniture: [],
    mouvementsRecents: [],
  });

  useEffect(() => {
    dispatch(getMouvements());
    dispatch(getMateriels());
    dispatch(getAffectations());
  }, [dispatch]);

  useEffect(() => {
    if (!materiels) return;

    // Statistiques de base
    const totalMateriels = materiels.length;
    const totalAffectations = affectations?.length || 0;
    const totalMouvements = mouvements?.length || 0;

    // Évolution mensuelle des mouvements
    const mouvementsParMois = {};
    mouvements?.forEach((m) => {
      const date = new Date(m.date_mouvement);
      const moisAnnee = `${date.getMonth() + 1}/${date.getFullYear()}`;
      mouvementsParMois[moisAnnee] = (mouvementsParMois[moisAnnee] || 0) + 1;
    });
    const mouvementsMensuels = Object.keys(mouvementsParMois)
      .map((key) => ({ mois: key, mouvements: mouvementsParMois[key] }))
      .sort(
        (a, b) =>
          new Date(a.mois.split("/")[1], a.mois.split("/")[0] - 1) -
          new Date(b.mois.split("/")[1], b.mois.split("/")[0] - 1),
      );

    // Répartition par fourniture
    const repartitionFourniture = materiels.reduce((acc, m) => {
      const cat = m.nom_fourniture || "Non fournituré";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    const categoriesData = Object.keys(repartitionFourniture).map((key) => ({
      name: key,
      value: repartitionFourniture[key],
    }));

    // Derniers mouvements
    const mouvementsRecents =
      mouvements?.slice(0, 5).map((m) => {
        const mat = materiels.find((mat) => mat.id_materiel === m.id_materiel);
        return { ...m, designation: mat?.designation || "N/A" };
      }) || [];

    setStats({
      totalMateriels,
      totalAffectations,
      totalMouvements,
      mouvementsParMois: mouvementsMensuels,
      repartitionParFourniture: categoriesData,
      mouvementsRecents,
    });
  }, [mouvements, materiels, affectations]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
  const formatNumber = (num) => new Intl.NumberFormat("fr-FR").format(num);

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard Général</h1>
        <div className="flex space-x-2 bg-white rounded-lg shadow p-1"></div>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Total Matériels</p>
            <p className="text-3xl font-bold">
              {formatNumber(stats.totalMateriels)}
            </p>
          </div>
          <FaBox className="text-3xl text-blue-500" />
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Total Affectations</p>
            <p className="text-3xl font-bold">
              {formatNumber(stats.totalAffectations)}
            </p>
          </div>
          <FaUsers className="text-3xl text-green-500" />
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Total Mouvements</p>
            <p className="text-3xl font-bold">
              {formatNumber(stats.totalMouvements)}
            </p>
          </div>
          <FaExchangeAlt className="text-3xl text-gray-500" />
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-500" /> Évolution des mouvements
          </h2>
          {stats.mouvementsParMois.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.mouvementsParMois}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="mouvements"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">
              Aucune donnée disponible
            </p>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Répartition par fourniture
          </h2>
          {stats.repartitionParFourniture.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.repartitionParFourniture}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.repartitionParFourniture.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">Aucune fourniture</p>
          )}
        </div>
      </div>

      {/* Derniers mouvements */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Derniers mouvements</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matériel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.mouvementsRecents.map((m, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(m.date_mouvement).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {m.designation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${m.type_mouvement === "entree" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {m.type_mouvement}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-bold">{m.quantite}</span> unités
                  </td>
                </tr>
              ))}
              {stats.mouvementsRecents.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Aucun mouvement récent
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
