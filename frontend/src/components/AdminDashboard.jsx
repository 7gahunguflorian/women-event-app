import React, { useState, useEffect } from 'react';
import { Search, Download, Edit2, Trash2, Check, X, LogOut, Home, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import StatsBox from './StatsBox';
import UserManagement from './UserManagement';
import { useToast } from '../contexts/ToastContext';

const AdminDashboard = ({ onLogout, onBackHome }) => {
  const { t } = useLanguage();
  const { token } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('registrations');
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSnack, setFilterSnack] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [regsResponse, statsResponse] = await Promise.all([
        fetch('/api/registrations', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/registrations/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (regsResponse.ok) {
        const regsData = await regsResponse.json();
        setRegistrations(regsData);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('admin.confirmDelete'))) return;

    try {
      const response = await fetch(`/api/registrations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const handleEdit = (registration) => {
    setEditingId(registration.id);
    setEditData(registration);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/api/registrations/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        setEditingId(null);
        fetchData();
      }
    } catch (err) {
      console.error('Error updating:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleToggleGroup = async (registration) => {
    try {
      const response = await fetch(`/api/registrations/${registration.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...registration,
          addedToGroup: registration.addedToGroup ? 0 : 1
        })
      });

      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error toggling group:', err);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/registrations/export/csv', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inscriptions.csv';
        a.click();
      }
    } catch (err) {
      console.error('Error exporting:', err);
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      (reg.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reg.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reg.phone || '').includes(searchTerm) ||
      (reg.church || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSnack = 
      filterSnack === 'all' ||
      (filterSnack === 'with' && reg.hasSnack === 'oui') ||
      (filterSnack === 'without' && reg.hasSnack === 'non');

    const matchesGroup = 
      filterGroup === 'all' ||
      (filterGroup === 'added' && reg.addedToGroup === 1) ||
      (filterGroup === 'notAdded' && reg.addedToGroup === 0);

    return matchesSearch && matchesSnack && matchesGroup;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-lavender-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-primary-700 dark:text-primary-300">
            {t('admin.title')}
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={onBackHome}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-smooth text-sm sm:text-base"
            >
              <Home size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Accueil</span>
            </button>
            {activeTab === 'registrations' && (
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-smooth text-sm sm:text-base"
              >
                <Download size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{t('admin.export')}</span>
              </button>
            )}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth text-sm sm:text-base"
            >
              <LogOut size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{t('admin.logout')}</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-4 py-2 font-medium transition-smooth text-sm sm:text-base ${
              activeTab === 'registrations'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-600'
            }`}
          >
            Inscriptions
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-smooth text-sm sm:text-base ${
              activeTab === 'users'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-600'
            }`}
          >
            <Users size={18} />
            Utilisateurs
          </button>
        </div>

        {activeTab === 'registrations' && <StatsBox stats={stats} />}

        {activeTab === 'users' ? (
          <UserManagement />
        ) : (

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('admin.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <select
              value={filterSnack}
              onChange={(e) => setFilterSnack(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">{t('admin.all')}</option>
              <option value="with">{t('admin.withSnack')}</option>
              <option value="without">{t('admin.withoutSnack')}</option>
            </select>

            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">{t('admin.all')}</option>
              <option value="added">{t('admin.added')}</option>
              <option value="notAdded">{t('admin.notAdded')}</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{t('admin.name')}</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{t('admin.age')}</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{t('admin.phone')}</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{t('admin.student')}</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{t('admin.church')}</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{t('admin.snack')}</th>
                  <th className="text-center p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{t('admin.addedToGroup')}</th>
                  <th className="text-center p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-smooth">
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-200">
                      {editingId === reg.id ? (
                        <input
                          type="text"
                          value={editData.firstName + ' ' + editData.lastName}
                          onChange={(e) => {
                            const [first, ...last] = e.target.value.split(' ');
                            setEditData({ ...editData, firstName: first, lastName: last.join(' ') });
                          }}
                          className="w-full px-2 py-1 border rounded dark:bg-gray-600"
                        />
                      ) : (
                        `${reg.firstName} ${reg.lastName}`
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-200">{reg.age}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-200">{reg.phone}</td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-200">
                      {reg.isStudent === 'oui' ? (
                        <span className="text-xs">
                          {reg.studentLevel} - {reg.studentLocation}
                        </span>
                      ) : (
                        'Non'
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-800 dark:text-gray-200">{reg.church}</td>
                    <td className="p-3">
                      {reg.hasSnack === 'oui' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs">
                          ✅ {reg.snackDetail}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                          ❌
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleToggleGroup(reg)}
                        className={`p-2 rounded-lg transition-smooth ${
                          reg.addedToGroup 
                            ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                        }`}
                      >
                        <Check size={16} />
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        {editingId === reg.id ? (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              className="p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-smooth"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-smooth"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(reg)}
                              className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-smooth"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(reg.id)}
                              className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-smooth"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRegistrations.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Aucune inscription trouvée
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
