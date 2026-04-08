import { Users } from 'lucide-react';
import { workers } from '../mocks/data';

export default function AdminDashboard() {
  const totalWorkers = workers.length;
  const metrics = [
    { title: 'Total Trabajadores', value: totalWorkers, icon: <Users size={24} className="text-primary-500" />, bg: 'bg-primary-50' },
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
    </div>
  );
}
