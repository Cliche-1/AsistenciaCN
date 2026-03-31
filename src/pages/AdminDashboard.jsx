import { Users, UserX, UserCheck, Activity } from 'lucide-react';
import { workers } from '../mocks/data';

export default function AdminDashboard() {
  const totalWorkers = workers.length;
  const metrics = [
    { title: 'Total Trabajadores', value: totalWorkers, icon: <Users size={24} className="text-primary-500" />, bg: 'bg-primary-50' },
    { title: 'Presentes Hoy', value: 0, icon: <UserCheck size={24} className="text-green-500" />, bg: 'bg-green-50' },
    { title: 'Ausentes', value: totalWorkers, icon: <UserX size={24} className="text-red-500" />, bg: 'bg-red-50' },
    { title: 'Días de Actividad', value: 1, icon: <Activity size={24} className="text-yellow-500" />, bg: 'bg-yellow-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Dashboard General</h1>
          <p className="text-gray-500 mt-1">Resumen general de asistencia del día de hoy.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 tracking-wide">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl ${metric.bg}`}>
              {metric.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">{metric.title}</p>
              <p className="text-3xl font-black text-dark-900 mt-1">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mt-8">
        <h3 className="text-lg font-bold text-dark-900 mb-4 border-b border-gray-100 pb-4">Actividad Reciente del Panel</h3>
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Activity size={48} className="mb-4 text-gray-200" />
          <p className="font-semibold text-gray-500">No hay marcaciones recientes en el sistema.</p>
          <p className="text-sm mt-1">Ve al Kiosco de la terminal para simular una asistencia hoy.</p>
        </div>
      </div>
    </div>
  );
}
