import React from 'react';
import { MessageCircle, Users, Coffee, MapPin, Calendar, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const InfoBox = () => {
  const { t } = useLanguage();

  const infoItems = [
    {
      icon: MessageCircle,
      text: t('info.whatsapp'),
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Users,
      text: t('info.age'),
      color: 'text-primary-600 dark:text-primary-400'
    },
    {
      icon: Coffee,
      text: t('info.snack'),
      color: 'text-lavender-600 dark:text-lavender-400'
    },
    {
      icon: MapPin,
      text: t('info.location'),
      color: 'text-pink-600 dark:text-pink-400'
    },
    {
      icon: Calendar,
      text: t('info.date'),
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Clock,
      text: t('info.time'),
      color: 'text-indigo-600 dark:text-indigo-400'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-primary-50 to-lavender-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-primary-700 dark:text-primary-300 mb-6">
        {t('info.title')}
      </h2>

      <div className="space-y-4">
        {infoItems.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-smooth"
          >
            <div className={`p-2 rounded-full bg-opacity-10 ${item.color.replace('text-', 'bg-')}`}>
              <item.icon className={item.color} size={24} />
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-primary-200 dark:border-primary-700">
        <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-3">
          {t('subtitle')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center italic">
          "Que la grâce et la paix vous soient multipliées"
        </p>
      </div>
    </div>
  );
};

export default InfoBox;
