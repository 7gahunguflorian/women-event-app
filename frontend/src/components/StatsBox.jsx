import React from 'react';
import { Users, Coffee, GraduationCap, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const StatsBox = ({ stats }) => {
  const { t } = useLanguage();

  const statItems = [
    {
      icon: Users,
      label: t('stats.total'),
      value: stats?.total || 0,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-100 dark:bg-primary-900'
    },
    {
      icon: Coffee,
      label: t('stats.withSnack'),
      value: `${stats?.withSnack || 0} (${stats?.snackPercentage || 0}%)`,
      color: 'from-lavender-500 to-lavender-600',
      bgColor: 'bg-lavender-100 dark:bg-lavender-900'
    },
    {
      icon: GraduationCap,
      label: t('stats.students'),
      value: stats?.students || 0,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    },
    {
      icon: MessageCircle,
      label: t('stats.addedToGroup'),
      value: stats?.addedToGroup || 0,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-smooth hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${item.bgColor}`}>
              <item.icon className={`bg-gradient-to-br ${item.color} bg-clip-text text-transparent`} size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{item.label}</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsBox;
