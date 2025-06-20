import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Landmark,
  PiggyBank,
  Target,
  Trophy,
  School,
  User,
  Settings,
  LogOut,
  ChevronFirst,
  ChevronLast
} from 'lucide-react';

// For now, we will have a static sidebar. We will add the collapse logic later.

const navItems = [
  { icon: <LayoutDashboard size={20} />, text: 'Dashboard', to: '/' },
  { icon: <Landmark size={20} />, text: 'Plan de Deudas', to: '/debts' },
  { icon: <PiggyBank size={20} />, text: 'Presupuesto', to: '/budget' },
  { icon: <Target size={20} />, text: 'Metas de Ahorro', to: '/savings' },
  { icon: <Trophy size={20} />, text: 'Retos', to: '/challenges' },
  { icon: <School size={20} />, text: 'Educación', to: '/education' },
];

const Sidebar = () => {
  // We will add state for expanded/collapsed later
  const isExpanded = true;

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-container border-r border-gray-700 shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <h1 className={`text-2xl font-bold text-primary ${isExpanded ? 'block' : 'hidden'}`}>FinFlow</h1>
          {/* Collapse button will go here */}
        </div>

        <ul className="flex-1 px-3">
          {navItems.map((item) => (
            <li key={item.text}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `
                  relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer
                  transition-colors group
                  ${isActive ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10 text-light-gray hover:text-white'}
                `}
              >
                {item.icon}
                <span className={`overflow-hidden transition-all ${isExpanded ? 'w-52 ml-3' : 'w-0'}`}>{item.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="border-t flex p-3 border-gray-700">
            <User/>
            <div className={`flex justify-between items-center overflow-hidden transition-all ${isExpanded ? "w-52 ml-3" : "w-0"}`}>
                <div className='leading-4'>
                    <h4 className='font-semibold'>Usuario</h4>
                    <span className='text-xs text-gray-600'>usuario@email.com</span>
                </div>
                <LogOut size={20} />
            </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar; 