import { useState, useEffect } from 'react';
import { Filter, FileSpreadsheet, Search, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { API_URL } from '../api';

export default function AdminRecords() {
  const [records, setRecords] = useState([]);

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState('all'); // 'all' or 'specific'
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [exportWorkerId, setExportWorkerId] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/attendance/records`)
      .then(res => res.json())
      .then(data => {
         const mapped = data.map(d => ({
            id: d.id,
            name: d.workerName,
            dni: d.workerDni,
            date: d.date,
            in: d.inTime,
            out: d.outTime,
            status: d.status
         }));
         setRecords(mapped);
      })
      .catch(err => console.error(err));
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredRecords = records.filter(r => {
    if (searchTerm && !r.name.toLowerCase().includes(searchTerm.toLowerCase()) && !r.dni.includes(searchTerm)) {
      return false;
    }

    if (statusFilter !== 'Todos' && r.status !== statusFilter) {
      return false;
    }

    const [day, month, year] = r.date.split('/');
    if (day && month && year) {
      const isoRecordDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      if (startDate && isoRecordDate < startDate) return false;
      if (endDate && isoRecordDate > endDate) return false;
    }

    return true;
  });

  const handleGenerateExport = () => {
    if (exportType === 'specific' && !exportWorkerId) {
      alert("Por favor, seleccione un trabajador.");
      return;
    }

    const dataToExport = records.filter(r => {
      // 1. Filtrar por trabajador específico
      if (exportType === 'specific' && r.dni !== exportWorkerId) return false;

      // 2. Filtrar por rango de fechas
      const [day, month, year] = r.date.split('/');
      if (day && month && year) {
        const isoRecordDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        if (exportStartDate && isoRecordDate < exportStartDate) return false;
        if (exportEndDate && isoRecordDate > exportEndDate) return false;
      }
      return true;
    });

    if (dataToExport.length === 0) {
      alert("No hay registros para exportar con estos filtros.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(r => ({
      'Trabajador': r.name,
      'DNI': r.dni,
      'Fecha': r.date,
      'Hora de Entrada': r.in,
      'Hora de Salida': r.out,
      'Estado': r.status,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencias");
    
    const workerNameForFile = exportType === 'specific' 
      ? dataToExport[0].name.replace(/\s+/g, '_') 
      : 'Todos';

    const filename = `Asistencias_${workerNameForFile}_${exportStartDate || 'Inicio'}_al_${exportEndDate || 'Fin'}.xlsx`;

    XLSX.writeFile(workbook, filename);
    setIsExportModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Registros de Asistencia</h1>
          <p className="text-gray-500 mt-1">Historial detallado y reportes exportables.</p>
        </div>
        <button 
          onClick={() => setIsExportModalOpen(true)}
          className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-green-500 hover:shadow-lg transition-all whitespace-nowrap"
        >
          <FileSpreadsheet size={18} />
          Exportar Excel
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50 flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
           
           <div className="flex flex-wrap items-center gap-3 w-full">
             <div className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-white px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm">
               <Filter size={16} />
               Filtros
             </div>

             <div className="relative flex-1 min-w-[220px] max-w-sm">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               <input 
                 type="text" 
                 placeholder="Buscar trabajador o DNI..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white shadow-sm"
               />
             </div>

             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
               className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-700 bg-white cursor-pointer shadow-sm min-w-[150px]"
             >
               <option value="Todos">Todos los Estados</option>
               <option value="A tiempo">A tiempo</option>
               <option value="Tardanza">Tardanza</option>
               <option value="Falta">Falta</option>
             </select>

             <div className="flex items-center bg-white border border-gray-200 rounded-lg pr-2 shadow-sm focus-within:ring-2 focus-within:ring-primary-500 transition-shadow">
               <span className="text-xs font-bold text-gray-400 uppercase ml-3 tracking-wider">Desde</span>
               <input 
                 type="date" 
                 value={startDate}
                 onChange={(e) => setStartDate(e.target.value)}
                 className="py-2.5 pl-2 pr-2 text-sm font-medium focus:outline-none text-gray-700 bg-transparent rounded-lg cursor-pointer" 
               />
               <span className="text-gray-200">|</span>
               <span className="text-xs font-bold text-gray-400 uppercase ml-3 tracking-wider">Hasta</span>
               <input 
                 type="date" 
                 value={endDate}
                 onChange={(e) => setEndDate(e.target.value)}
                 className="py-2.5 pl-2 pr-2 text-sm font-medium focus:outline-none text-gray-700 bg-transparent rounded-lg cursor-pointer" 
               />
             </div>
             
             {(searchTerm || statusFilter !== 'Todos' || startDate || endDate) && (
               <button 
                 onClick={() => {
                   setSearchTerm('');
                   setStatusFilter('Todos');
                   setStartDate('');
                   setEndDate('');
                 }}
                 className="text-xs font-bold text-red-500 hover:text-red-700 underline underline-offset-2 ml-2 transition-colors uppercase tracking-wider"
               >
                 Limpiar
               </button>
             )}
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4">Trabajador</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4 text-center">H. Entrada</th>
                <th className="px-6 py-4 text-center">H. Salida</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-dark-900">{r.name}</div>
                      <div className="text-xs font-bold text-gray-500 tabular-nums font-mono mt-0.5">{r.dni}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-sm text-gray-600">{r.date}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-gray-100 px-3 py-1 rounded-md text-gray-700 font-mono text-sm font-semibold">{r.in}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-gray-100 px-3 py-1 rounded-md text-gray-700 font-mono text-sm font-semibold">{r.out}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        r.status === 'A tiempo' ? 'bg-green-100 text-green-800' : 
                        r.status === 'Tardanza' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-gray-400 font-medium bg-gray-50/50">
                    No se encontraron registros de asistencia que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-dark-900 flex items-center gap-2">
                <FileSpreadsheet className="text-green-600" size={20} />
                Exportar Reporte
              </h3>
              <button onClick={() => setIsExportModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Tipo de Reporte a Exportar</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setExportType('all')}
                    className={`px-4 py-3 rounded-xl border text-sm font-bold flex items-center justify-center transition-all ${exportType === 'all' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setExportType('specific')}
                    className={`px-4 py-3 rounded-xl border text-sm font-bold flex items-center justify-center transition-all ${exportType === 'specific' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Exclusivo
                  </button>
                </div>
              </div>

              {exportType === 'specific' && (
                <div className="animate-fade-in-up">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Seleccionar Trabajador</label>
                  <select 
                    value={exportWorkerId}
                    onChange={e => setExportWorkerId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="">-- Seleccione un trabajador --</option>
                    {Array.from(new Map(records.map(r => [r.dni, { name: r.name, dni: r.dni }])).values()).map(w => (
                      <option key={w.dni} value={w.dni}>{w.name} ({w.dni})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Desde (Opcional)</label>
                  <input 
                    type="date"
                    value={exportStartDate}
                    onChange={e => setExportStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Hasta (Opcional)</label>
                  <input 
                    type="date"
                    value={exportEndDate}
                    onChange={e => setExportEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-600"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleGenerateExport}
                className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-colors flex items-center gap-2"
              >
                <FileSpreadsheet size={18} />
                Descargar Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
