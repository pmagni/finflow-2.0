import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/debts': 'Gestión de Deudas',
  '/budget': 'Presupuesto',
  '/savings': 'Metas de Ahorro',
  '/chat': 'Asistente Financiero IA',
  '/challenges': 'Retos y Logros',
  '/education': 'Educación Financiera',
  '/profile': 'Mi Perfil',
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? '';

  return (
    <div className="flex h-dvh overflow-hidden bg-surface-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(true)} title={title} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
