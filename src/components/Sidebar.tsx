import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiGrid,
  FiTarget,
  FiPieChart,
  FiBookOpen,
  FiTrendingUp,
  FiLogOut,
  FiUser
} from "react-icons/fi";

const navLinks = [
  { to: "/", text: "Dashboard", icon: FiGrid },
  { to: "/debts", text: "Plan de Deudas", icon: FiTrendingUp },
  { to: "/budget", text: "Presupuesto", icon: FiPieChart },
  { to: "/savings", text: "Metas de Ahorro", icon: FiTarget },
  { to: "/challenges", text: "Retos", icon: FiBookOpen },
  { to: "/education", text: "Educación", icon: FiBookOpen },
];

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <aside className="w-64 bg-darkSecondary text-darkLightText flex flex-col p-4">
      <div className="text-2xl font-bold mb-10">FinFlow</div>
      <nav className="flex-1">
        <ul>
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center p-2 my-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-darkAccent text-white"
                      : "hover:bg-darkAccent"
                  }`
                }
              >
                <link.icon className="mr-3" />
                {link.text}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <div className="p-2 flex items-center">
          <FiUser className="mr-3" />
          <div>
            <p className="font-semibold">Usuario</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center p-2 mt-2 text-left rounded-lg hover:bg-darkAccent"
        >
          <FiLogOut className="mr-3" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
} 