import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import PhoneInput from './PhoneInput';
import ClosedStamp from './ClosedStamp';
import { APP_CONFIG } from '../config';

// Configuration: Voir src/config.js pour activer/désactiver les inscriptions
const REGISTRATIONS_OPEN = APP_CONFIG.REGISTRATIONS_OPEN;

const RegistrationForm = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    phone: '',
    isStudent: '',
    studentLevel: '',
    studentLocation: '',
    church: '',
    hasSnack: '',
    snackDetail: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset student fields if not a student
    if (name === 'isStudent' && value === 'non') {
      setFormData(prev => ({
        ...prev,
        studentLevel: '',
        studentLocation: ''
      }));
    }

    // Reset snack detail if no snack
    if (name === 'hasSnack' && value === 'non') {
      setFormData(prev => ({
        ...prev,
        snackDetail: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(t('messages.success'), 'success');
        setFormData({
          firstName: '',
          lastName: '',
          age: '',
          phone: '',
          isStudent: '',
          studentLevel: '',
          studentLocation: '',
          church: '',
          hasSnack: '',
          snackDetail: ''
        });
        // Scroll to top after successful submission
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        showToast(data.error || t('messages.error'), 'error');
      }
    } catch (err) {
      showToast(t('messages.error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Tampon "Inscriptions terminées" */}
      {!REGISTRATIONS_OPEN && <ClosedStamp />}

      <h2 className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4 sm:mb-6">
        {t('title')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('form.firstName')} *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-smooth"
              required
              disabled={!REGISTRATIONS_OPEN}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('form.lastName')} *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-smooth"
              required
              disabled={!REGISTRATIONS_OPEN}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('form.age')} *
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="15"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-smooth"
              required
              disabled={!REGISTRATIONS_OPEN}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('form.phone')} *
            </label>
            <PhoneInput
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={!REGISTRATIONS_OPEN}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('form.isStudent')} *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="isStudent"
                value="oui"
                checked={formData.isStudent === 'oui'}
                onChange={handleChange}
                className="text-primary-600 focus:ring-primary-500"
                required
                disabled={!REGISTRATIONS_OPEN}
              />
              <span className="text-gray-700 dark:text-gray-300">{t('form.yes')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="isStudent"
                value="non"
                checked={formData.isStudent === 'non'}
                onChange={handleChange}
                className="text-primary-600 focus:ring-primary-500"
                required
                disabled={!REGISTRATIONS_OPEN}
              />
              <span className="text-gray-700 dark:text-gray-300">{t('form.no')}</span>
            </label>
          </div>
        </div>

        {formData.isStudent === 'oui' && (
          <div className="space-y-4 p-4 bg-primary-50 dark:bg-gray-700 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('form.studentLevel')} *
              </label>
              <select
                name="studentLevel"
                value={formData.studentLevel}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white transition-smooth text-sm sm:text-base"
                required
                disabled={!REGISTRATIONS_OPEN}
              >
                <option value="">-- Sélectionnez --</option>
                <option value="secondaire">{t('form.secondary')}</option>
                <option value="université">{t('form.university')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('form.studentLocation')} *
              </label>
              <input
                type="text"
                name="studentLocation"
                value={formData.studentLocation}
                onChange={handleChange}
                placeholder="Ex: Université du Burundi"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white transition-smooth text-sm sm:text-base"
                required
                disabled={!REGISTRATIONS_OPEN}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('form.church')}
          </label>
          <input
            type="text"
            name="church"
            value={formData.church}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-smooth"
            disabled={!REGISTRATIONS_OPEN}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('form.hasSnack')} *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="hasSnack"
                value="oui"
                checked={formData.hasSnack === 'oui'}
                onChange={handleChange}
                className="text-primary-600 focus:ring-primary-500"
                required
                disabled={!REGISTRATIONS_OPEN}
              />
              <span className="text-gray-700 dark:text-gray-300">{t('form.yes')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="hasSnack"
                value="non"
                checked={formData.hasSnack === 'non'}
                onChange={handleChange}
                className="text-primary-600 focus:ring-primary-500"
                required
                disabled={!REGISTRATIONS_OPEN}
              />
              <span className="text-gray-700 dark:text-gray-300">{t('form.no')}</span>
            </label>
          </div>
        </div>

        {formData.hasSnack === 'oui' && (
          <div className="p-4 bg-lavender-50 dark:bg-gray-700 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('form.snackDetail')} *
            </label>
            <input
              type="text"
              name="snackDetail"
              value={formData.snackDetail}
              onChange={handleChange}
              placeholder="Ex: Gâteau, fruits, boissons..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white transition-smooth"
              required
              disabled={!REGISTRATIONS_OPEN}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !REGISTRATIONS_OPEN}
          className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-primary-600 to-lavender-600 text-white rounded-lg hover:from-primary-700 hover:to-lavender-700 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth hover:scale-105 shadow-lg text-sm sm:text-base"
        >
          <Send size={18} className="sm:w-5 sm:h-5" />
          <span className="font-semibold">
            {loading ? t('form.submitting') : t('form.submit')}
          </span>
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
