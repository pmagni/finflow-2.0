import { useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleAuthAction = async () => {
    if (isSigningUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        console.error("Error signing up:", error);
      } else {
        alert("Check your email for the confirmation link!");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Error signing in:", error);
      }
    }
  };

  const handleOAuthLogin = async (provider: "github" | "google") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
    });
    if (error) {
      console.error(`Error logging in with ${provider}:`, error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-darkPrimary">
      <div className="p-8 bg-darkSecondary rounded-2xl shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="#2AF5C1"/>
            <path d="M12 12L22 7" stroke="#0E1111" strokeWidth="1.5"/>
            <path d="M12 12V22" stroke="#0E1111" strokeWidth="1.5"/>
            <path d="M12 12L2 7" stroke="#0E1111" strokeWidth="1.5"/>
            <path d="M17 4.5L7 9.5" stroke="#0E1111" strokeWidth="1.5"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          {isSigningUp ? "Crea una cuenta" : "Bienvenido de Vuelta"}
        </h1>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-darkAccent border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-darkAccent border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
          />
          <button
            onClick={handleAuthAction}
            className="w-full bg-primary text-black font-bold p-3 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            {isSigningUp ? "Registrarse" : "Iniciar Sesión"}
          </button>
        </div>
        
        {/* Social Logins can be added here if needed, following the style */}

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSigningUp(!isSigningUp)}
            className="text-light-gray hover:text-white transition-colors"
          >
            {isSigningUp
              ? "¿Ya tienes una cuenta? Inicia Sesión"
              : "¿No tienes una cuenta? Regístrate"}
          </button>
        </div>
      </div>
    </div>
  );
} 