import React from 'react';

const Input = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  error = '',
  className = '',
  required = false,
  disabled = false,
  ...props
}) => {
  const baseClasses = 'w-full border rounded px-3 py-2 transition-colors focus:outline-none focus:ring-2';
  const errorClasses = error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-primary focus:border-primary';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : '';

  const inputClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClasses}
        required={required}
        disabled={disabled}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
