import React from 'react';

type CardProps = {
  children?: React.ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-900 rounded-lg shadow-lg p-4 md:p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card; 