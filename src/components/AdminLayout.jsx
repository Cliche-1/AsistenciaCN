import { Outlet, Navigate, useNavigate, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Clock, LogOut, FileEdit } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', end: true },
    { path: '/admin/workers', icon: <Users size={20} />, label: 'Trabajadores' },
    { path: '/admin/records', icon: <Clock size={20} />, label: 'Registros diarios' },
    { path: '/admin/edit-records', icon: <FileEdit size={20} />, label: 'Modificar Asistencias' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/login');
  };

  return (
    <div className="flex bg-gray-50 h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-900 text-gray-300 flex flex-col transition-all">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <h1 className="text-white font-bold text-lg tracking-wide uppercase">Admin<span className="text-primary-500">Panel</span></h1>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-lg transition-colors font-medium text-sm ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'hover:bg-dark-800 hover:text-white'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-gray-800/50 hover:text-red-300 transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-bold text-dark-800">Panel de Control</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
              A
            </div>
            <span className="text-sm font-semibold text-dark-800">Admin</span>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
