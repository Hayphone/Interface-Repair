import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, UserCircle, Users, PenTool as Tool, Package } from 'lucide-react';
import { useAuthStore } from '../stores/auth';

const Navbar = () => {
  const { user, signOut } = useAuthStore();

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Wrench className="h-8 w-8" />
              <span className="text-xl font-bold">SmartDiscount31</span>
            </Link>

            {user && (
              <div className="flex items-center space-x-4">
                <Link to="/customers" className="flex items-center space-x-1 hover:text-indigo-200">
                  <Users className="h-5 w-5" />
                  <span>Clients</span>
                </Link>
                <Link to="/repairs" className="flex items-center space-x-1 hover:text-indigo-200">
                  <Tool className="h-5 w-5" />
                  <span>Réparations</span>
                </Link>
                <Link to="/inventory" className="flex items-center space-x-1 hover:text-indigo-200">
                  <Package className="h-5 w-5" />
                  <span>Inventaire</span>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-1 hover:text-indigo-200"
              >
                <UserCircle className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 hover:text-indigo-200">
                <UserCircle className="h-5 w-5" />
                <span>Connexion</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;