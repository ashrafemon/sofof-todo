import React from 'react';
import { cn } from '../../utils/helpers';

type IProps = {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, className, loading = false, ...props }: IProps) => {
  return (
    <button type="button" className={cn('btn', className)} {...props}>
      {loading && <span className="loading loading-spinner"></span>}
      {children}
    </button>
  );
};

export default Button;
