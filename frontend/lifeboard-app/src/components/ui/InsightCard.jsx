const iconMap = {
  trophy:  '🏆',
  warning: '⚠️',
  alert:   '🔔',
  fire:    '🔥',
};

const colorMap = {
  trophy:  'border-yellow-500/30 bg-yellow-500/5',
  warning: 'border-orange-500/30 bg-orange-500/5',
  alert:   'border-red-500/30 bg-red-500/5',
  fire:    'border-blue-500/30 bg-blue-500/5',
};

function InsightCard({ type, message, icon }) {
  return (
    <div className={`border rounded-xl p-4 flex items-start gap-3 ${colorMap[icon] || 'border-gray-700 bg-gray-800/50'}`}>
      <span className="text-xl">{iconMap[icon] || '💡'}</span>
      <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
    </div>
  );
}

export default InsightCard;