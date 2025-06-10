import React from 'react';

interface AlertMessageProps {
  message: string;
  type: 'error' | 'success'; // You can extend this for different types of alerts
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message, type }) => {
  const bgColor = type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700';
  const iconColor = type === 'error' ? 'text-red-500' : 'text-green-500';

  return (
    <div className={`border px-4 py-3 rounded relative ${bgColor}`} role="alert">
      <strong className="font-bold">
        <span className={`inline-block mr-2 ${iconColor}`}>
          {type === 'error' ? '!' : '✓'}
        </span>
      </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default AlertMessage;