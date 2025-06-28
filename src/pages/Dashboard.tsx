import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import { FiTrendingUp, FiCheckCircle, FiStar, FiTarget } from "react-icons/fi";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Bienvenido de nuevo, {user?.email?.split('@')[0]} 👋</h1>
      <p>Aquí tienes un resumen de tu salud financiera.</p>

      <div className="dashboard">
        {/* Financial Health */}
        <Card title="Salud Financiera">
          <div className="flex items-center gap-4">
            <FiCheckCircle size={32} style={{ color: '#10b981' }} />
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>8.5/10</p>
              <p style={{ color: '#6b7280', margin: 0 }}>¡Excelente!</p>
            </div>
          </div>
        </Card>

        {/* Debt Summary */}
        <Card title="Resumen de Deuda">
          <div className="flex items-center gap-4">
            <FiTrendingUp size={32} style={{ color: '#ef4444' }} />
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>$12,450.00</p>
              <p style={{ color: '#6b7280', margin: 0 }}>en 3 deudas activas</p>
            </div>
          </div>
        </Card>

        {/* AI Suggestion */}
        <Card title="Sugerencia IA">
          <div className="flex items-center gap-4">
            <FiStar size={32} style={{ color: '#f59e0b' }} />
            <div>
              <p style={{ color: '#4b5563', margin: 0 }}>
                Considera usar el método "Bola de Nieve" para liquidar tu tarjeta de crédito más pequeña este mes.
              </p>
            </div>
          </div>
        </Card>

        {/* Next Goal */}
        <Card title="Próxima Meta">
          <div className="flex items-center gap-4">
            <FiTarget size={32} style={{ color: '#3b82f6' }} />
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>$1,500 / $5,000</p>
              <p style={{ color: '#6b7280', margin: 0 }}>para "Fondo de Emergencia"</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}