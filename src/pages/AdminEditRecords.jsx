import { useState } from 'react';
import { Search, Edit2, Save, X, UserSearch } from 'lucide-react';
import { workers } from '../mocks/data';

const mockRecords = [
  { id: 1, workerId: 1, date: new Date().toLocaleDateString('es-ES'), in: '08:00', out: '17:05', status: 'A tiempo' },
  { id: 2, workerId: 1, date: '30/03/2026', in: '08:15', out: '17:10', status: 'Tarde' },
  { id: 3, workerId: 2, date: new Date().toLocaleDateString('es-ES'), in: '08:05', out: '17:00', status: 'A tiempo' },
];

export default function AdminEditRecords() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [records, setRecords] = useState(mockRecords);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [editForm, setEditForm] = useState({ in: '', out: '', status: '' });

  const suggestedWorkers = searchTerm.length > 1 
    ? workers.filter(w => w.name.toLowerCase().includes(searchTerm.toLowerCase()) || w.dni.includes(searchTerm))
    : [];

  const handleSelectWorker = (w) => {
    setSelectedWorker(w);
    setSearchTerm('');
  };

  const startEditing = (record) => {
    setEditingRecordId(record.id);
    setEditForm({ in: record.in, out: record.out, status: record.status });
  };

  const cancelEditing = () => {
    setEditingRecordId(null);
  };

  const saveEditing = (id) => {
    setRecords(records.map(r => r.id === id ? { ...r, ...editForm } : r));
    setEditingRecordId(null);
  };

  const workerRecords = records.filter(r => selectedWorker && r.workerId === selectedWorker.id);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Modificar Asistencias</h1>
          <p className="text-gray-500 mt-1">Busca a un trabajador para editar sus horas registradas.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
        <div className="max-w-xl mx-auto mb-10 relative">
          <label className="block text-sm font-bold text-gray-700 mb-2">Buscar Empleado por Nombre o DNI</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Ej. Juan Pérez o 12345678"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-dark-900 font-medium bg-gray-50"
            />
            {suggestedWorkers.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                {suggestedWorkers.map(w => (
                  <button 
                    key={w.id}
                    onClick={() => handleSelectWorker(w)}
                    className="w-full text-left px-5 py-3 hover:bg-primary-50 border-b border-gray-100 last:border-0 flex items-center justify-between transition-colors"
                  >
                    <span className="font-bold text-dark-900">{w.name}</span>
                    <span className="text-sm text-gray-400 font-mono tracking-wide">{w.dni}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedWorker ? (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 rounded-full flex items-center justify-center font-black text-2xl uppercase shadow-inner">
                  {selectedWorker.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-900">{selectedWorker.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5 text-sm font-semibold">
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">DNI: {selectedWorker.dni}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-primary-600">{selectedWorker.area}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedWorker(null)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-bold transition-colors">
                Cambiar
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                    <th className="px-5 py-4">Fecha</th>
                    <th className="px-5 py-4 text-center">Hora Entrada</th>
                    <th className="px-5 py-4 text-center">Hora Salida</th>
                    <th className="px-5 py-4">Estado Resultante</th>
                    <th className="px-5 py-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {workerRecords.map(r => (
                    <tr key={r.id} className={editingRecordId === r.id ? 'bg-primary-50/30' : 'hover:bg-gray-50/50 transition-colors'}>
                      <td className="px-5 py-4 font-medium text-sm text-gray-600">{r.date}</td>
                      <td className="px-5 py-4 text-center">
                        {editingRecordId === r.id ? (
                          <input type="time" value={editForm.in} onChange={e => setEditForm({...editForm, in: e.target.value})} className="px-3 py-1.5 border border-primary-300 rounded-lg text-sm w-32 focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm" />
                        ) : (
                          <span className="bg-gray-100 border border-gray-200 px-3 py-1 rounded-md text-gray-700 font-mono text-sm font-semibold">{r.in}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {editingRecordId === r.id ? (
                          <input type="time" value={editForm.out} onChange={e => setEditForm({...editForm, out: e.target.value})} className="px-3 py-1.5 border border-primary-300 rounded-lg text-sm w-32 focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm" />
                        ) : (
                          <span className="bg-gray-100 border border-gray-200 px-3 py-1 rounded-md text-gray-700 font-mono text-sm font-semibold">{r.out}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {editingRecordId === r.id ? (
                          <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} className="px-3 py-1.5 border border-primary-300 rounded-lg text-sm min-w-[120px] focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm cursor-pointer">
                            <option value="A tiempo">A tiempo</option>
                            <option value="Tarde">Tarde</option>
                            <option value="Falta">Falta</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            r.status === 'A tiempo' ? 'bg-green-100 text-green-800' : 
                            r.status === 'Tarde' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {r.status}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {editingRecordId === r.id ? (
                          <div className="flex justify-end gap-2">
                            <button onClick={cancelEditing} className="px-3 py-1.5 bg-gray-100 text-gray-600 font-bold text-xs rounded-lg hover:bg-gray-200 transition-colors uppercase tracking-wider">
                              Cancelar
                            </button>
                            <button onClick={() => saveEditing(r.id)} className="px-3 py-1.5 bg-green-600 text-white font-bold text-xs rounded-lg hover:bg-green-500 transition-colors flex items-center gap-1 uppercase tracking-wider shadow-sm">
                              <Save size={14} /> Guardar
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => startEditing(r)} className="p-2 text-primary-600 bg-primary-50 hover:bg-primary-100 hover:text-primary-700 rounded-lg transition-colors flex items-center gap-2 font-bold text-xs uppercase" title="Modificar">
                            <Edit2 size={14} /> Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {workerRecords.length === 0 && (
                     <tr><td colSpan="5" className="px-5 py-16 text-center text-gray-400 font-medium">Sin historial de asistencias previo.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center pt-8 pb-12">
            <div className="mx-auto h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <UserSearch className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-600">Ningún empleado seleccionado</h3>
            <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">Selecciona o busca un empleado en la barra superior para ver su registro de tiempos y realizar correcciones.</p>
          </div>
        )}
      </div>
    </div>
  );
}
