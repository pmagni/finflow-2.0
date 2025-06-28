import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="header">
      <div className="title">FinFlow</div>
      <nav>
        <a href="/">Dashboard</a>
        <a href="/debts">Deudas</a>
        <a href="/budget">Presupuesto</a>
        <a href="/savings">Ahorros</a>
        <a href="/chat">Chat IA</a>
      </nav>
      <div>
        {user && (
          <button onClick={signOut} className="btn btn-secondary">
            Cerrar Sesión
          </button>
        )}
      </div>
    </header>
  );
}