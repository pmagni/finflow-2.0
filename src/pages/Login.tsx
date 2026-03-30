import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Loader2, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { user, loading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isSigningUp) {
        const { error: authError } = await signUp(email, password, name);
        if (authError) {
          setError(authError);
        } else {
          navigate('/');
        }
      } else {
        const { error: authError } = await signIn(email, password);
        if (authError) {
          setError('Credenciales inválidas. Verifica tu correo y contraseña.');
        } else {
          navigate('/');
        }
      }
    } catch {
      setError('Ocurrió un error inesperado. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-dvh bg-surface-50">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-dvh">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">FinFlow</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight">
              Tu bienestar financiero comienza aquí
            </h1>
            <p className="mt-4 text-lg text-primary-100 leading-relaxed">
              Gestiona deudas, construye presupuestos inteligentes y alcanza tus metas de ahorro con la ayuda de inteligencia artificial.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-6">
              <div>
                <p className="text-3xl font-bold">100%</p>
                <p className="mt-1 text-sm text-primary-200">Privacidad garantizada</p>
              </div>
              <div>
                <p className="text-3xl font-bold">IA</p>
                <p className="mt-1 text-sm text-primary-200">Asistente financiero</p>
              </div>
              <div>
                <p className="text-3xl font-bold">0</p>
                <p className="mt-1 text-sm text-primary-200">Datos bancarios requeridos</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-primary-200">
            Privacidad primero. Sin conexión bancaria requerida.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary-500/30" />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary-500/20" />
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12 bg-surface-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-600">
              <TrendingUp className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900">FinFlow</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-surface-900">
              {isSigningUp ? 'Crear cuenta' : 'Bienvenido de vuelta'}
            </h2>
            <p className="mt-2 text-sm text-surface-500">
              {isSigningUp
                ? 'Ingresa tus datos para comenzar'
                : 'Ingresa tus credenciales para continuar'}
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-lg bg-danger-50 border border-danger-200 p-3.5">
              <p className="text-sm text-danger-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSigningUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-surface-700 mb-1.5">
                  Nombre completo
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-lg border border-surface-300 bg-white text-surface-900 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Juan Pérez"
                  disabled={isSubmitting}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg border border-surface-300 bg-white text-surface-900 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="tu@email.com"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-surface-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSigningUp ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3.5 pr-11 rounded-lg border border-surface-300 bg-white text-surface-900 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting
                ? 'Procesando...'
                : isSigningUp
                  ? 'Crear cuenta'
                  : 'Iniciar sesión'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500">
            {isSigningUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button
              onClick={() => {
                setIsSigningUp(!isSigningUp);
                setError('');
              }}
              className="font-semibold text-primary-600 hover:text-primary-700 cursor-pointer transition-colors"
              disabled={isSubmitting}
            >
              {isSigningUp ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
