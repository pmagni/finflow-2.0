import React from 'react';

type CardProps = {
  children?: React.ReactNode;
  className?: string;
  title?: string;
};

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;