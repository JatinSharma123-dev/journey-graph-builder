/**
 * Reusable Card component for consistent layout
 */

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

/**
 * Card component with consistent styling
 */
export const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
  padding = 'md'
}) => {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b">
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className={paddingStyles[padding]}>
        {children}
      </div>
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

/**
 * Card header component
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action
}) => {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="text-gray-600 mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};