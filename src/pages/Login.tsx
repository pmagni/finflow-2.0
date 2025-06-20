import { supabase } from "../services/supabase";

export default function Login() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github", // or other providers like google, etc.
    });
    if (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">FinFlow Login</h1>
        <button
          onClick={handleLogin}
          className="w-full bg-gray-800 text-white p-2 rounded"
        >
          Login with GitHub
        </button>
      </div>
    </div>
  );
} 