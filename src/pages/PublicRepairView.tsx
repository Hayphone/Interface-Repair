import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, PenTool as Tool, Package, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { REPAIR_STATUS_LABELS, REPAIR_STATUS_COLORS } from '../stores/repairs';

function PublicRepairView() {
  const { id } = useParams<{ id: string }>();
  const [repair, setRepair] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    loadRepairData();

    // Set up real-time subscription
    const channel = supabase
      .channel(`repair:${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'repairs',
          filter: `id=eq.${id}`
        },
        () => {
          loadRepairData();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [id]);

  const loadRepairData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('repairs')
        .select(`
          *,
          devices (
            *,
            customers (*)
          ),
          repair_media (*),
          repair_messages (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setRepair(data);
    } catch (err) {
      console.error('Error loading repair:', err);
      setError('Impossible de charger les détails de la réparation');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !id) return;

    try {
      setSendingMessage(true);
      const { error } = await supabase
        .from('repair_messages')
        .insert({
          repair_id: id,
          content: newMessage.trim(),
          sender: 'client'
        });

      if (error) throw error;
      setNewMessage('');
      await loadRepairData();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Erreur lors de l\'envoi du message');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !repair) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Réparation non trouvée
          </h2>
          <p className="text-gray-600">
            Cette page n'existe pas ou n'est plus accessible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Suivi de réparation
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                REPAIR_STATUS_COLORS[repair.status as keyof typeof REPAIR_STATUS_COLORS]
              }`}>
                {REPAIR_STATUS_LABELS[repair.status as keyof typeof REPAIR_STATUS_LABELS]}
              </span>
            </div>
          </div>

          <div className="p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Appareil</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {repair.devices?.brand} {repair.devices?.model}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Numéro de série</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {repair.devices?.serial_number || 'Non spécifié'}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {repair.description}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Date de création</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(repair.created_at).toLocaleDateString('fr-FR')}
                </dd>
              </div>
              {repair.estimated_cost && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Coût estimé</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {repair.estimated_cost} €
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Photos et Vidéos */}
        {repair.repair_media && repair.repair_media.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Photos et Vidéos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {repair.repair_media.map((media: any) => (
                  <div key={media.id} className="relative">
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt="Media"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={media.url}
                        className="w-full h-40 object-cover rounded-lg"
                        controls
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Messages
            </h2>
            <div className="space-y-4 mb-4">
              {repair.repair_messages && repair.repair_messages.length > 0 ? (
                repair.repair_messages.map((message: any) => (
                  <div
                    key={message.id}
                    className={`flex flex-col ${
                      message.sender === 'client' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.sender === 'client'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(message.created_at).toLocaleString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit'
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  Aucun message. Commencez la conversation !
                </p>
              )}
            </div>

            <form onSubmit={handleSendMessage}>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !newMessage.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicRepairView;