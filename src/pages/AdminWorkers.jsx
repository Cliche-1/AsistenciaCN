import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { workers as initialWorkers } from '../mocks/data';

export default function AdminWorkers() {
  const [workers, setWorkers] = useState(initialWorkers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.dni.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Gestión de Trabajadores</h1>
          <p className="text-gray-500 mt-1">Administra el talento humano de la empresa.</p>
        </div>
        <button className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-500 hover:shadow-lg transition-all">
          <Plus size={18} />
          Nuevo Trabajador
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nombre o DNI..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 border-b border-gray-100">Nombres y Apellidos</th>
                <th className="px-6 py-4 border-b border-gray-100">DNI</th>
                <th className="px-6 py-4 border-b border-gray-100">Área</th>
                <th className="px-6 py-4 border-b border-gray-100">Estado</th>
                <th className="px-6 py-4 border-b border-gray-100 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredWorkers.map(w => (
                <tr key={w.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-dark-900">{w.name}</td>
                  <td className="px-6 py-4 tabular-nums text-gray-600 font-mono text-sm">{w.dni}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium text-sm">{w.area}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      w.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredWorkers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium border-t border-gray-100">
                    No se encontraron trabajadores.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
