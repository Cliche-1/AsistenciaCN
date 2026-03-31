import { useState, useEffect } from 'react';
import { Filter, FileSpreadsheet, Search } from 'lucide-react';
import * as XLSX from 'xlsx';
import { API_URL } from '../api';

export default function AdminRecords() {
  const [records, setRecords] = useState([]);

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

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRecords.map(r => ({
      'Trabajador': r.name,
      'DNI': r.dni,
      'Fecha': r.date,
      'Hora de Entrada': r.in,
      'Hora de Salida': r.out,
      'Estado': r.status,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencias");
    XLSX.writeFile(workbook, `Reporte_Asistencias.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Registros de Asistencia</h1>
          <p className="text-gray-500 mt-1">Historial detallado y reportes exportables.</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-green-500 hover:shadow-lg transition-all whitespace-nowrap"
        >
          <FileSpreadsheet size={18} />
          Exportar Excel ({filteredRecords.length})
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
               <option value="Tarde">Tarde</option>
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
                        r.status === 'Tarde' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
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
    </div>
  );
}
