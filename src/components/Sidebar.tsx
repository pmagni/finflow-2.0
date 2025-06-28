import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiGrid,
  FiTarget,
  FiPieChart,
  FiBookOpen,
  FiTrendingUp,
  FiLogOut,
  FiUser,
  FiMessageCircle
} from "react-icons/fi";

const navLinks = [
  { to: "/", text: "Dashboard", icon: FiGrid },
  { to: "/debts", text: "Plan de Deudas", icon: FiTrendingUp },
  { to: "/budget", text: "Presupuesto", icon: FiPieChart },
  { to: "/savings", text: "Metas de Ahorro", icon: FiTarget },
  { to: "/chat", text: "Chat IA", icon: FiMessageCircle },
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
    <aside className="sidebar">
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', color: '#61dafb' }}>
        FinFlow
      </div>
      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {navLinks.map((link) => (
            <li key={link.to} style={{ marginBottom: '0.5rem' }}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-colors text-decoration-none ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`
                }
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: isActive ? 'white' : '#d1d5db',
                  backgroundColor: isActive ? '#3b82f6' : 'transparent',
                  transition: 'all 0.2s'
                })}
              >
                <link.icon size={20} />
                {link.text}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
        <div style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FiUser size={20} />
          <div>
            <p style={{ fontWeight: '600', margin: 0, fontSize: '0.9rem' }}>Usuario</p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="btn btn-danger"
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            justifyContent: 'center',
            marginTop: '0.5rem'
          }}
        >
          <FiLogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}