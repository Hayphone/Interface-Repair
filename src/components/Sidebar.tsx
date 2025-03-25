import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Wrench,
  Package,
  Settings,
  UserCircle,
  LogOut,
  Smartphone,
  Archive,
  Stethoscope
} from 'lucide-react';
import { useAuthStore } from '../stores/auth';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle }) => {
  const location = useLocation();
  const { user, role, signOut } = useAuthStore();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/customers', icon: Users, label: 'Clients' },
    { path: '/repairs', icon: Wrench, label: 'Réparations' },
    { path: '/repairs/archived', icon: Archive, label: 'Archives' },
    { path: '/inventory', icon: Package, label: 'Inventaire' },
    { path: '/diagnostics', icon: Stethoscope, label: 'Diagnostics' },
    { path: '/settings', icon: Settings, label: 'Paramètres', adminOnly: true },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-indigo-900 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      <button
        onClick={onToggle}
        className="absolute -right-4 top-9 bg-indigo-900 rounded-full p-2 text-white hover:bg-indigo-800 focus:outline-none shadow-lg"
      >
        {isExpanded ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </button>

      <div className="p-4">
        <div className="flex items-center mb-8">
          <Wrench className={`h-10 w-10 transition-all duration-300 ${isExpanded ? 'mr-3' : 'mx-auto'}`} />
          {isExpanded && (
            <span className="text-xl font-bold text-white">SmartDiscount31</span>
          )}
        </div>

        <nav className="space-y-2">
          {menuItems
            .filter(item => !item.adminOnly || role === 'admin')
            .map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-800'
                }`}
              >
                <item.icon className={`h-6 w-6 transition-all duration-300 ${isExpanded ? 'mr-3' : 'mx-auto'}`} />
                {isExpanded && <span className="text-sm">{item.label}</span>}
              </Link>
            ))}
        </nav>
      </div>

      {user && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-800">
          <div className="flex items-center mb-4">
            <UserCircle className={`h-6 w-6 transition-all duration-300 ${isExpanded ? 'mr-3' : 'mx-auto'}`} />
            {isExpanded && (
              <div>
                <div className="text-sm font-medium text-white">{user.email}</div>
                <div className="text-xs text-indigo-300">{role === 'admin' ? 'Administrateur' : 'Utilisateur'}</div>
              </div>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2 text-indigo-100 hover:bg-indigo-800 rounded-lg transition-colors"
          >
            <LogOut className={`h-6 w-6 transition-all duration-300 ${isExpanded ? 'mr-3' : 'mx-auto'}`} />
            {isExpanded && <span className="text-sm">Déconnexion</span>}
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;