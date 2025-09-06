import React from 'react';
import Button from './Button';

type IProps = {
  label?: string;
  open?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
};

const Dialog = ({
  open = false,
  onClose = () => {},
  label,
  children,
}: IProps) => {
  if (!open) return null;

  return (
    <dialog className="modal" open={open}>
      <div className="modal-box">
        {label && <h3 className="font-bold text-lg mb-3">{label}</h3>}

        <Button
          className="btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          x
        </Button>

        {children}
      </div>
    </dialog>
  );
};

export default Dialog;
