import Card from '../components/Card';
import { ShieldCheck, TrendingUp, Sparkles, Target } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white">Bienvenido de nuevo 👋</h1>
        <p className="text-light-gray">Aquí tienes un resumen de tu salud financiera.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Salud Financiera */}
        <Card className="flex flex-col items-center justify-center text-center">
          <ShieldCheck size={40} className="text-primary mb-3" />
          <h2 className="text-xl font-semibold text-white mb-1">Salud Financiera</h2>
          <p className="text-4xl font-bold text-primary">8.5/10</p>
          <p className="text-sm text-light-gray mt-1">¡Excelente!</p>
        </Card>

        {/* Card 2: Resumen de Deuda */}
        <Card>
          <div className="flex items-center mb-3">
            <TrendingUp size={24} className="text-error mr-3" />
            <h2 className="text-xl font-semibold text-white">Resumen de Deuda</h2>
          </div>
          <p className="text-3xl font-bold text-white">$12,450.00</p>
          <p className="text-sm text-light-gray">en 3 deudas activas</p>
        </Card>
        
        {/* Card 3: Sugerencia IA */}
        <Card className="bg-primary/10 border border-primary/30">
          <div className="flex items-center mb-3">
            <Sparkles size={24} className="text-primary mr-3" />
            <h2 className="text-xl font-semibold text-white">Sugerencia IA</h2>
          </div>
          <p className="text-light-gray">Considera usar el método "Bola de Nieve" para liquidar tu tarjeta de crédito más pequeña este mes.</p>
        </Card>

        {/* Card 4: Meta de Ahorro */}
        <Card>
          <div className="flex items-center mb-3">
            <Target size={24} className="text-blue-400 mr-3" />
            <h2 className="text-xl font-semibold text-white">Próxima Meta</h2>
          </div>
          <p className="text-3xl font-bold text-white">$1,500 / $5,000</p>
          <p className="text-sm text-light-gray">para "Fondo de Emergencia"</p>
        </Card>
      </div>
    </div>
  );
}
