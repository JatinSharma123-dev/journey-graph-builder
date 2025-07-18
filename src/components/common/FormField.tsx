/**
 * Reusable form field components
 */

import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component for form fields with consistent styling
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  children,
  className = ''
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Styled input component
 */
export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  className = ''
}) => {
  const baseStyles = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors';
  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`${baseStyles} ${disabledStyles} ${className}`}
    />
  );
};

interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * Styled textarea component
 */
export const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
  className = ''
}) => {
  const baseStyles = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical';
  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`${baseStyles} ${disabledStyles} ${className}`}
    />
  );
};

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Styled select component
 */
export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  className = ''
}) => {
  const baseStyles = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors';
  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`${baseStyles} ${disabledStyles} ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};