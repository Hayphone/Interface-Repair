import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/CustomerList';
import CustomerForm from './pages/CustomerForm';
import RepairList from './pages/RepairList';
import RepairForm from './pages/RepairForm';
import RepairDetail from './pages/RepairDetail';
import ArchivedRepairs from './pages/ArchivedRepairs';
import InventoryList from './pages/InventoryList';
import ImeiCheckList from './pages/ImeiCheckList';
import PublicRepairView from './pages/PublicRepairView';
import Login from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/repairs/:id/public" element={<PublicRepairView />} />
        
        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />
                <div 
                  className="flex-1 transition-all duration-300 ease-in-out"
                  style={{ marginLeft: isExpanded ? '16rem' : '5rem' }}
                >
                  <div className="p-8">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/customers" element={<CustomerList />} />
                      <Route path="/customers/new" element={<CustomerForm />} />
                      <Route path="/repairs" element={<RepairList />} />
                      <Route path="/repairs/archived" element={<ArchivedRepairs />} />
                      <Route path="/repairs/new" element={<RepairForm />} />
                      <Route path="/repairs/:id" element={<RepairDetail />} />
                      <Route path="/inventory" element={<InventoryList />} />
                      <Route path="/imei-check" element={<ImeiCheckList />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;