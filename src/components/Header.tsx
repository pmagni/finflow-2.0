import { Menu, Bell } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  title?: string;
}

export default function Header({ onMenuToggle, title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 h-16 px-4 sm:px-6 bg-white/80 backdrop-blur-md border-b border-surface-200">
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 hover:text-surface-700 lg:hidden cursor-pointer transition-colors"
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5" />
      </button>

      {title && (
        <h1 className="text-lg font-semibold text-surface-900">{title}</h1>
      )}

      <div className="ml-auto flex items-center gap-2">
        <button
          className="relative p-2 rounded-lg text-surface-500 hover:bg-surface-100 hover:text-surface-700 cursor-pointer transition-colors"
          aria-label="Notificaciones"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
