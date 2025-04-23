import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseClasses = 'button flex items-center justify-center rounded transition-colors';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizeClasses = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  };

  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClass} ${className}`;

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
