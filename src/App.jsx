import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Attendance from './pages/Attendance';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminWorkers from './pages/AdminWorkers';
import AdminRecords from './pages/AdminRecords';
import AdminEditRecords from './pages/AdminEditRecords';
import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Attendance />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="workers" element={<AdminWorkers />} />
          <Route path="records" element={<AdminRecords />} />
          <Route path="edit-records" element={<AdminEditRecords />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
