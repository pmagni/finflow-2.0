import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div
      className={`bg-container p-6 rounded-2xl shadow-md ${className}`}
    >
      {children}
    </div>
  );
};

export default Card; 