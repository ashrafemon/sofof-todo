import React from 'react';
import { cn } from '../../utils/helpers';

type IProps = {
  label?: React.ReactNode;
  error?: boolean;
  helperText?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ label, className, error, helperText, ...props }: IProps) => {
  return (
    <div className="w-full flex flex-col gap-1">
      {label && <p className="text-sm font-medium">{label}</p>}
      <input
        type="text"
        className={cn('input w-full', className, { 'input-error': error })}
        {...props}
      />
      {helperText && (
        <p className={cn('text-xs', { 'text-error': error })}>{helperText}</p>
      )}
    </div>
  );
};

export default Input;
