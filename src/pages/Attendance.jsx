import { useState, useEffect } from 'react';
import { Clock, UserCheck, UserMinus, ShieldAlert } from 'lucide-react';
import { workers } from '../mocks/data';

export default function Attendance() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [type, setType] = useState('ENTRADA'); // 'ENTRADA' or 'SALIDA'
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDniChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
    setDni(val);
  };

  const isDniValid = dni.length === 8;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isDniValid) return;

    setLoading(true);
    setMessage(null);

    setTimeout(() => {
      setLoading(false);
      const worker = workers.find(w => w.dni === dni);
      if (worker) {
        setMessage({ type: 'success', text: `¡${type} registrada para ${worker.name}!` });
      } else {
        setMessage({ type: 'error', text: 'DNI no encontrado en el sistema.' });
      }
      setDni('');
      
      setTimeout(() => setMessage(null), 3000);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary-50 items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-primary-500/10 border border-primary-100 overflow-hidden relative">
        <div className="bg-dark-900 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400"></div>
          <div className="flex items-center justify-center gap-3 mb-2 opacity-80">
            <Clock size={24} className="text-primary-400" />
            <h2 className="text-lg font-medium tracking-wide">Reloj Biométrico Online</h2>
          </div>
          <div className="text-6xl font-black tracking-tight tabular-nums">
            {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-primary-200 mt-2 text-sm uppercase tracking-widest font-semibold">
            {currentTime.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="flex gap-4 mb-10 w-full justify-center">
            <button
              onClick={() => { setType('ENTRADA'); setMessage(null); }}
              className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                type === 'ENTRADA' 
                  ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md scale-105' 
                  : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200 hover:bg-white'
              }`}
            >
              <UserCheck size={32} className="mb-2" />
              <span className="font-bold text-lg">ENTRADA</span>
            </button>
            <button
              onClick={() => { setType('SALIDA'); setMessage(null); }}
              className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                type === 'SALIDA' 
                  ? 'border-red-500 bg-red-50 text-red-700 shadow-md scale-105' 
                  : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200 hover:bg-white'
              }`}
            >
              <UserMinus size={32} className="mb-2" />
              <span className="font-bold text-lg">SALIDA</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 relative">
              <label htmlFor="dni" className="text-sm font-bold text-dark-800 uppercase tracking-wider text-center">
                Ingrese su DNI
              </label>
              <input
                id="dni"
                type="text"
                autoFocus
                value={dni}
                onChange={handleDniChange}
                placeholder="Ej. 12345678"
                className="w-full text-center text-5xl font-black py-4 border-b-4 border-gray-200 outline-none focus:border-primary-500 transition-colors bg-transparent tabular-nums text-dark-900 placeholder:text-gray-300"
                disabled={loading}
                autoComplete="off"
              />
              <div className="h-6 mt-1 flex justify-center">
                {dni.length > 0 && !isDniValid && (
                  <span className="text-red-500 text-sm font-medium flex items-center gap-1 animate-fade-in-up">
                    <ShieldAlert size={14} /> Faltan {8 - dni.length} dígitos
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!isDniValid || loading}
              className={`w-full py-5 rounded-2xl text-xl font-bold uppercase tracking-widest transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                !isDniValid
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none border-t-2 border-white'
                  : type === 'ENTRADA'
                  ? 'bg-primary-600 text-white hover:bg-primary-500 hover:-translate-y-1 hover:shadow-primary-500/25'
                  : 'bg-red-600 text-white hover:bg-red-500 hover:-translate-y-1 hover:shadow-red-500/25'
              }`}
            >
              {loading ? (
                <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                `MARCAR ${type}`
              )}
            </button>
          </form>

          <div className="h-16 mt-6 w-full flex justify-center items-center">
            {message && (
              <div className={`w-full px-6 py-4 rounded-xl font-bold text-center animate-fade-in-up ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800 border-2 border-green-300'
                  : 'bg-red-100 text-red-800 border-2 border-red-300'
              }`}>
                {message.text}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <a href="/login" className="absolute bottom-6 text-primary-400/60 text-sm hover:text-dark-900 transition-colors font-semibold tracking-wider uppercase">
        Acceso Administrador
      </a>
    </div>
  );
}
