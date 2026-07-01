import React from 'react';

const Card = ({ children, className = '', glass = false }) => {
  const baseStyles = 'rounded-2xl border shadow-xl';
  const glassStyles = glass
    ? 'bg-zinc-900/60 backdrop-blur-xl border-zinc-800/50'
    : 'bg-zinc-900 border-zinc-800';

  return <div className={`${baseStyles} ${glassStyles} ${className}`}>{children}</div>;
};

const CardHeader = ({ children, className = '' }) => {
  return <div className={`p-6 border-b border-zinc-800/50 ${className}`}>{children}</div>;
};

const CardBody = ({ children, className = '' }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

const CardFooter = ({ children, className = '' }) => {
  return <div className={`p-6 border-t border-zinc-800/50 ${className}`}>{children}</div>;
};

export { Card, CardHeader, CardBody, CardFooter };
