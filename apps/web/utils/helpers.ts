import clsx, { ClassValue } from 'clsx';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const validateError = (data: Record<string, string | string[]>) => {
  const validate: { [key: string]: string | undefined } = {};
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      validate[key] = data[key][0];
    } else {
      validate[key] = data[key];
    }
  });
  return validate;
};

export const promptMessage = (
  cb = () => {},
  alert: boolean = true,
  title: string = 'Are you sure?',
  text: string = 'Do you want to continue?',
  icon: SweetAlertIcon = 'question',
  btnText: string = 'Yes, Delete it',
) => {
  if (alert) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: btnText,
      showCancelButton: true,
      focusCancel: true,
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        cb();
      }
      return false;
    });
  } else {
    cb();
  }
};

export const alertMessage = (payload: SweetAlertOptions) => {
  Swal.fire(payload);
};
