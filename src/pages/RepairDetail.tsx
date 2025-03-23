import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Clock, PenTool as Tool, Package, User, CheckCircle, XCircle, AlertTriangle, Share2, Mail, MessageSquare, Copy, ExternalLink } from 'lucide-react';
import { useRepairStore, REPAIR_STATUS, REPAIR_STATUS_LABELS, REPAIR_STATUS_COLORS } from '../stores/repairs';
import { LabelPrinter } from '../components/LabelPrinter';
import { MediaUpload } from '../components/MediaUpload';
import { RepairChat } from '../components/RepairChat';

function RepairDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRepair, updateRepairStatus, uploadMedia, deleteMedia, sendMessage, loading, error } = useRepairStore();
  const [repair, setRepair] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [shareMethod, setShareMethod] = useState<'email' | 'sms' | null>(null);
  const [recipientContact, setRecipientContact] = useState('');
  const publicUrl = `${window.location.origin}/repairs/${id}/public`;

  useEffect(() => {
    if (id) {
      loadRepairData();
    }
  }, [id]);

  const loadRepairData = async () => {
    if (!id) return;
    const data = await getRepair(id);
    setRepair(data);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!id || isUpdating) return;
    try {
      setIsUpdating(true);
      await updateRepairStatus(id, newStatus);
      await loadRepairData();
      setShowStatusModal(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMediaUpload = async (file: File) => {
    if (!id) return;
    try {
      await uploadMedia(id, file);
      await loadRepairData();
    } catch (error) {
      console.error('Error uploading media:', error);
    }
  };

  const handleMediaDelete = async (mediaId: string) => {
    if (!id) return;
    try {
      await deleteMedia(id, mediaId);
      await loadRepairData();
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!id) return;
    try {
      await sendMessage(id, content, 'technician');
      await loadRepairData();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (shareMethod === 'email') {
      const subject = encodeURIComponent('Suivi de votre réparation');
      const body = encodeURIComponent(`Bonjour,\n\nVoici le lien pour suivre l'avancement de votre réparation :\n${publicUrl}\n\nCordialement,\nSmartDiscount31`);
      window.open(`mailto:${recipientContact}?subject=${subject}&body=${body}`);
    } else if (shareMethod === 'sms') {
      const formattedPhone = recipientContact.replace(/\s/g, '')
        .replace(/^0/, '+33');
      window.open(`sms:${formattedPhone}?body=${encodeURIComponent(`Suivi de votre réparation : ${publicUrl}`)}`);
    }

    setShareMethod(null);
    setRecipientContact('');
    setShowShareModal(false);
  };

  const getNextStatus = (currentStatus: string) => {
    const statusOrder = [
      REPAIR_STATUS.PENDING,
      REPAIR_STATUS.IN_PROGRESS,
      REPAIR_STATUS.COMPLETED,
      REPAIR_STATUS.DELIVERED
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return currentIndex < statusOrder.length - 1 ? statusOrder[currentIndex + 1] : null;
  };

  const renderShareButton = () => (
    <button
      onClick={() => setShowShareModal(true)}
      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <Share2 className="h-4 w-4 mr-2" />
      Partager
    </button>
  );

  const renderShareModal = () => (
    showShareModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Partager le suivi de réparation
          </h3>

          <div className="space-y-4">
            {!shareMethod && (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Choisissez comment partager le lien de suivi avec votre client
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setShareMethod('email')}
                    className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <Mail className="h-6 w-6 text-blue-500 mb-2" />
                    <span className="text-sm">Email</span>
                  </button>
                  
                  <button
                    onClick={() => setShareMethod('sms')}
                    className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <MessageSquare className="h-6 w-6 text-green-500 mb-2" />
                    <span className="text-sm">SMS</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(publicUrl);
                      alert('Lien copié dans le presse-papier !');
                    }}
                    className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <Copy className="h-6 w-6 text-gray-500 mb-2" />
                    <span className="text-sm">Copier</span>
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={publicUrl}
                      readOnly
                      className="flex-1 rounded-l-md border-gray-300 bg-gray-50"
                    />
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                    >
                      <ExternalLink className="h-5 w-5 text-gray-600" />
                    </a>
                  </div>
                </div>
              </>
            )}

            {shareMethod === 'email' && (
              <form onSubmit={handleShare} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse email du client
                  </label>
                  <input
                    type="email"
                    value={recipientContact}
                    onChange={(e) => setRecipientContact(e.target.value)}
                    placeholder="client@example.com"
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShareMethod(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    Envoyer par email
                  </button>
                </div>
              </form>
            )}

            {shareMethod === 'sms' && (
              <form onSubmit={handleShare} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de téléphone du client
                  </label>
                  <input
                    type="tel"
                    value={recipientContact}
                    onChange={(e) => setRecipientContact(e.target.value)}
                    placeholder="06 12 34 56 78"
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShareMethod(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    Envoyer par SMS
                  </button>
                </div>
              </form>
            )}
          </div>

          {!shareMethod && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <XCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!repair) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Réparation non trouvée</h3>
      </div>
    );
  }

  const nextStatus = getNextStatus(repair.status);
  const currentStatusConfig = {
    icon: repair.status === REPAIR_STATUS.PENDING ? <Clock className="h-5 w-5 text-yellow-500" /> :
          repair.status === REPAIR_STATUS.IN_PROGRESS ? <Tool className="h-5 w-5 text-blue-500" /> :
          repair.status === REPAIR_STATUS.COMPLETED ? <CheckCircle className="h-5 w-5 text-green-500" /> :
          <Package className="h-5 w-5 text-purple-500" />,
    label: REPAIR_STATUS_LABELS[repair.status as keyof typeof REPAIR_STATUS_LABELS],
    style: REPAIR_STATUS_COLORS[repair.status as keyof typeof REPAIR_STATUS_COLORS],
    description: repair.status === REPAIR_STATUS.PENDING ? 'La réparation a été enregistrée et est en attente de prise en charge' :
                repair.status === REPAIR_STATUS.IN_PROGRESS ? 'La réparation est en cours de traitement' :
                repair.status === REPAIR_STATUS.COMPLETED ? 'La réparation est terminée, en attente de récupération' :
                'L\'appareil a été récupéré par le client'
  };

  const labelData = {
    customerName: repair.devices?.customers?.[0]?.name || 'Client inconnu',
    deviceInfo: `${repair.devices?.brand} ${repair.devices?.model} - ${repair.devices?.serial_number || 'S/N: N/A'}`,
    repairDescription: repair.description,
    status: repair.status,
    repairId: repair.id,
    date: new Date(repair.created_at).toLocaleDateString('fr-FR')
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Détails de la Réparation
        </h1>
        <div className="flex space-x-4">
          {renderShareButton()}
          <button
            onClick={() => navigate('/repairs')}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Retour à la liste
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {currentStatusConfig.icon}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentStatusConfig.style}`}>
                {currentStatusConfig.label}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {nextStatus && (
                <button
                  onClick={() => handleStatusUpdate(nextStatus)}
                  disabled={isUpdating}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center">
                    {nextStatus === REPAIR_STATUS.IN_PROGRESS && <Tool className="h-4 w-4 mr-1" />}
                    {nextStatus === REPAIR_STATUS.COMPLETED && <CheckCircle className="h-4 w-4 mr-1" />}
                    {nextStatus === REPAIR_STATUS.DELIVERED && <Package className="h-4 w-4 mr-1" />}
                    {REPAIR_STATUS_LABELS[nextStatus]}
                  </span>
                </button>
              )}
              <button
                onClick={() => setShowStatusModal(true)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Modifier
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {currentStatusConfig.description}
          </p>
        </div>

        <div className="px-6 py-4">
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
              <dt className="text-sm font-medium text-gray-500">Coût estimé</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {repair.estimated_cost ? `${repair.estimated_cost} €` : 'Non spécifié'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Date de création</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(repair.created_at).toLocaleDateString('fr-FR')}
              </dd>
            </div>
          </dl>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Photos et Vidéos</h3>
              <MediaUpload
                onUpload={handleMediaUpload}
                onDelete={handleMediaDelete}
                media={repair.repair_media}
                loading={loading}
              />
            </div>

            <div className="border-l pl-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Messages</h3>
              <div className="h-[400px] bg-gray-50 rounded-lg">
                <RepairChat
                  messages={repair.repair_messages || []}
                  onSendMessage={handleSendMessage}
                  loading={loading}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <LabelPrinter data={labelData} />
          </div>
        </div>
      </div>

      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Changer le statut
            </h3>
            <div className="space-y-2">
              {Object.entries(REPAIR_STATUS_LABELS).map(([status, label]) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={isUpdating}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    repair.status === status
                      ? REPAIR_STATUS_COLORS[status as keyof typeof REPAIR_STATUS_COLORS]
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {status === REPAIR_STATUS.PENDING && <Clock className="h-5 w-5 mr-2" />}
                  {status === REPAIR_STATUS.IN_PROGRESS && <Tool className="h-5 w-5 mr-2" />}
                  {status === REPAIR_STATUS.COMPLETED && <CheckCircle className="h-5 w-5 mr-2" />}
                  {status === REPAIR_STATUS.DELIVERED && <Package className="h-5 w-5 mr-2" />}
                  <span className="ml-3">{label}</span>
                  {repair.status === status && (
                    <CheckCircle className="ml-auto h-5 w-5" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {renderShareModal()}
    </div>
  );
}

export default RepairDetail;