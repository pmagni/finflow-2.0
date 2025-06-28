import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";

export default function Login() {
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  const handleAuthAction = async () => {
    if (isSigningUp) {
      console.log("Signing up with:", email);
    } else {
      const { error } = await signIn(email, password);
      if (!error) {
        navigate('/');
      } else {
        alert(`Login failed: ${error}`);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <Card>
          <div className="text-center mb-4">
            <h1 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>FinFlow</h1>
            <h2>{isSigningUp ? 'Crear Cuenta' : 'Bienvenido de Vuelta'}</h2>
          </div>
          
          <form className="some-component" onSubmit={(e) => { e.preventDefault(); handleAuthAction(); }}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="tu@email.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {isSigningUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </button>
          </form>
          
          <p className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
            {isSigningUp ? '¿Ya tienes una cuenta?' : "¿No tienes una cuenta?"}
            <button 
              onClick={() => setIsSigningUp(!isSigningUp)} 
              style={{ 
                marginLeft: '0.25rem', 
                fontWeight: '500', 
                color: '#3b82f6', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isSigningUp ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}