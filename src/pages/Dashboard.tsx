import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import { FiTrendingUp, FiCheckCircle, FiStar, FiTarget } from "react-icons/fi";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-2">
        Bienvenido de nuevo, {user?.email} 👋
      </h1>
      <p className="text-gray-400 mb-8">
        Aquí tienes un resumen de tu salud financiera.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Financial Health */}
        <Card>
          <div className="flex items-center mb-4">
            <FiCheckCircle className="text-2xl text-green-400 mr-3" />
            <h2 className="text-xl font-bold text-white">Salud Financiera</h2>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-400">8.5/10</p>
            <p className="text-gray-400">¡Excelente!</p>
          </div>
        </Card>

        {/* Debt Summary */}
        <Card>
          <div className="flex items-center mb-4">
            <FiTrendingUp className="text-2xl text-red-400 mr-3" />
            <h2 className="text-xl font-bold text-white">Resumen de Deuda</h2>
          </div>
          <div>
            <p className="text-3xl font-bold">$12,450.00</p>
            <p className="text-gray-400">en 3 deudas activas</p>
          </div>
        </Card>

        {/* AI Suggestion */}
        <Card>
          <div className="flex items-center mb-4">
            <FiStar className="text-2xl text-yellow-400 mr-3" />
            <h2 className="text-xl font-bold text-white">Sugerencia IA</h2>
          </div>
          <p className="text-gray-300">
            Considera usar el método "Bola de Nieve" para liquidar tu tarjeta de crédito más pequeña este mes.
          </p>
        </Card>

        {/* Next Goal */}
        <Card className="lg:col-span-1">
           <div className="flex items-center mb-4">
            <FiTarget className="text-2xl text-blue-400 mr-3" />
            <h2 className="text-xl font-bold text-white">Próxima Meta</h2>
          </div>
          <div>
            <p className="text-3xl font-bold">$1,500 / $5,000</p>
            <p className="text-gray-400">para "Fondo de Emergencia"</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
