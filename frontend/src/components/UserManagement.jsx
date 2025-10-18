import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Users } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Utilisateur créé avec succès', 'success');
        setNewUser({ username: '', password: '' });
        setShowAddForm(false);
        fetchUsers();
      } else {
        showToast(data.error || 'Erreur lors de la création', 'error');
      }
    } catch (error) {
      showToast('Erreur lors de la création de l\'utilisateur', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showToast('Utilisateur supprimé avec succès', 'success');
        fetchUsers();
      } else {
        const data = await response.json();
        showToast(data.error || 'Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Users className="text-primary-600" size={24} />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            Gestion des utilisateurs
          </h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-smooth text-sm sm:text-base"
        >
          <UserPlus size={18} />
          Ajouter un utilisateur
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddUser} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
                required
                minLength={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
                required
                minLength={6}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-smooth text-sm sm:text-base"
            >
              {loading ? 'Création...' : 'Créer'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewUser({ username: '', password: '' });
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-smooth text-sm sm:text-base"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 sm:px-4 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">
                ID
              </th>
              <th className="text-left py-3 px-2 sm:px-4 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">
                Nom d'utilisateur
              </th>
              <th className="text-right py-3 px-2 sm:px-4 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-3 px-2 sm:px-4 text-sm sm:text-base text-gray-800 dark:text-gray-200">
                  {user.id}
                </td>
                <td className="py-3 px-2 sm:px-4 text-sm sm:text-base text-gray-800 dark:text-gray-200">
                  {user.username}
                </td>
                <td className="py-3 px-2 sm:px-4 text-right">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-smooth text-sm"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Supprimer</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          Aucun utilisateur trouvé
        </p>
      )}
    </div>
  );
};

export default UserManagement;
