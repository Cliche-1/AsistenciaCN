import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, KeyRound, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('adminAuth', 'true');
        navigate('/admin');
      } else {
        setError('Credenciales incorrectas. Intente nuevamente.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 to-primary-400"></div>
      
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2 transition-colors font-medium text-sm"
      >
        <ArrowLeft size={18} />
        <span>Volver al Kiosco</span>
      </button>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex justify-center items-center w-16 h-16 rounded-full bg-primary-600 shadow-lg shadow-primary-500/30 ring-8 ring-primary-900/50">
          <Lock className="text-white" size={30} />
        </div>
        <h2 className="mt-8 text-center text-3xl font-extrabold text-white tracking-tight">
          Panel de Administración
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400 font-medium">
          Control de Asistencia Biométrico
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-dark-800 py-8 px-4 shadow-2xl shadow-black/50 sm:rounded-2xl sm:px-10 border border-gray-700/50">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-500 text-sm font-semibold text-center animate-fade-in-up">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Usuario
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl leading-5 bg-dark-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                  placeholder="Ingrese su usuario"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Contraseña
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl leading-5 bg-dark-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all focus:ring-offset-dark-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  'Ingresar al panel'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
