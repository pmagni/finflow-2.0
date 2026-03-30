import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  PiggyBank,
  MessageSquare,
  Trophy,
  GraduationCap,
  User,
  LogOut,
  X,
  TrendingUp,
  Building2,
  Receipt,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/debts', icon: CreditCard, label: 'Deudas' },
  { to: '/budget', icon: Wallet, label: 'Presupuesto' },
  { to: '/savings', icon: PiggyBank, label: 'Ahorros' },
  { to: '/chat', icon: MessageSquare, label: 'Asistente IA' },
  { to: '/challenges', icon: Trophy, label: 'Retos' },
  { to: '/education', icon: GraduationCap, label: 'Educación' },
  { to: '/organizations', icon: Building2, label: 'Organizaciones' },
  { to: '/transactions', icon: Receipt, label: 'Transacciones' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, signOut } = useAuth();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 h-dvh w-64 flex flex-col
          bg-white border-r border-surface-200
          transition-transform duration-200 ease-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-surface-200">
          <NavLink to="/" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600">
              <TrendingUp className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold text-surface-900">FinFlow</span>
          </NavLink>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-600 lg:hidden cursor-pointer transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-800'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-surface-200 p-3 space-y-1">
          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-800'
              }`
            }
          >
            <User className="w-5 h-5 shrink-0" />
            <span className="truncate">{user?.email ?? 'Mi Perfil'}</span>
          </NavLink>
          <button
            onClick={signOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-danger-600 hover:bg-danger-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
