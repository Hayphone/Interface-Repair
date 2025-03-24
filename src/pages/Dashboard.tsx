import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClipboardList, PenTool as Tool, Package, Users, Loader, ArrowRight, Plus, Smartphone } from 'lucide-react';
import { useDashboardStore } from '../stores/dashboard';
import { supabase } from '../lib/supabase';
import { PriceCalculator } from '../components/PriceCalculator';

const Dashboard = () => {
  const { metrics, recentRepairs, loading, error, fetchDashboardData } = useDashboardStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    // Set up real-time subscription
    const repairs = supabase
      .channel('repairs_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'repairs'
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      repairs.unsubscribe();
    };
  }, [fetchDashboardData]);

  const handleImeiCheck = () => {
    window.open('https://imeicheck.com/user/imei', '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">Erreur: {error}</p>
      </div>
    );
  }

  const metricCards = [
    {
      icon: <ClipboardList className="h-8 w-8 text-blue-500" />,
      title: "Réparations en cours",
      value: metrics.activeRepairs.toString(),
      path: "/repairs",
      filter: "?status=pending,in_progress",
      color: "bg-blue-50 hover:bg-blue-100"
    },
    {
      icon: <Tool className="h-8 w-8 text-green-500" />,
      title: "Réparations terminées",
      value: metrics.completedRepairs.toString(),
      path: "/repairs",
      filter: "?status=completed,delivered",
      color: "bg-green-50 hover:bg-green-100"
    },
    {
      icon: <Package className="h-8 w-8 text-purple-500" />,
      title: "Pièces en stock",
      value: metrics.totalInventoryItems.toString(),
      path: "/inventory",
      color: "bg-purple-50 hover:bg-purple-100"
    },
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      title: "Clients actifs",
      value: metrics.activeCustomers.toString(),
      path: "/customers",
      color: "bg-orange-50 hover:bg-orange-100"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleImeiCheck}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-transform duration-200 hover:scale-105"
          >
            <Smartphone className="h-5 w-5 mr-2" />
            Vérifier IMEI/SN
          </button>
          <Link
            to="/repairs/new"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-transform duration-200 hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle Réparation
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, index) => (
          <button
            key={index}
            onClick={() => navigate(card.path + (card.filter || ''))}
            className={`${card.color} p-6 rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>{card.icon}</div>
              <h3 className="text-2xl font-bold">{card.value}</h3>
            </div>
            <p className="mt-2 text-gray-600">{card.title}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Réparations récentes</h2>
            <Link
              to="/repairs"
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
            >
              Voir tout
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentRepairs.length === 0 ? (
              <p className="p-6 text-center text-gray-500">
                Aucune réparation récente
              </p>
            ) : (
              recentRepairs.map((repair) => (
                <div key={repair.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {repair.devices?.brand} {repair.devices?.model}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {repair.description}
                      </p>
                    </div>
                    <StatusBadge status={repair.status} />
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Client: {repair.customers?.[0]?.name}</p>
                    <p>Date: {new Date(repair.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <PriceCalculator />
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    delivered: 'bg-purple-100 text-purple-800'
  };

  const statusLabels = {
    pending: 'En attente',
    in_progress: 'En cours',
    completed: 'Terminé',
    delivered: 'Livré'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs leading-5 font-semibold ${statusStyles[status as keyof typeof statusStyles]}`}>
      {statusLabels[status as keyof typeof statusLabels]}
    </span>
  );
};

export default Dashboard;