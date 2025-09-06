import React from 'react';
import { cn } from '../../utils/helpers';

type IProps = {
  label?: React.ReactNode;
  error?: boolean;
  helperText?: string;
  className?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = ({
  label,
  className,
  error,
  helperText,
  ...props
}: IProps) => {
  return (
    <div className="w-full flex flex-col gap-1">
      {label && <p className="text-sm font-medium">{label}</p>}
      <textarea
        className={cn('textarea w-full', className, {
          'textarea-error': error,
        })}
        {...props}
      ></textarea>
      {helperText && (
        <p className={cn('text-xs', { 'text-error': error })}>{helperText}</p>
      )}
    </div>
  );
};

export default Textarea;
