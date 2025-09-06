'use client';

import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { decodeToken } from 'react-jwt';
import { useDispatch } from 'react-redux';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useCreateLoginMutation } from '../../../stores/actions/auth';
import { setAuthentication } from '../../../stores/reducers/auth';
import { Login } from '../../../types/auth';
import {
  ApiErrorResponseInterface,
  ApiOkResponseInterface,
  ApiValidateErrorDataType,
  ResponseType,
} from '../../../types/base';
import { alertMessage, validateError } from '../../../utils/helpers';

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [create, result] = useCreateLoginMutation();

  const { control, handleSubmit, setError } = useForm<Login>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const successCallbackHandler = (res: ApiOkResponseInterface) => {
    if (res.status === ResponseType.SUCCESS) {
      alertMessage({ title: res.message, icon: 'success', timer: 3000 });
      const token = (res.data as { token: string })?.token;
      const decode = decodeToken(token);
      dispatch(
        setAuthentication({
          token: token,
          isAuthenticate: true,
          user: decode,
        }),
      );
      Cookie.set('todoToken', token);
      router.replace('/');
    }
  };

  const errorCallbackHandler = (err: ApiErrorResponseInterface) => {
    if (err.status === ResponseType.VALIDATE_ERROR) {
      const errors = validateError(err.data as ApiValidateErrorDataType);
      Object.keys(errors).forEach((fieldName) =>
        setError(fieldName as keyof Login, {
          type: 'manual',
          message: errors[fieldName],
        }),
      );
    } else {
      alertMessage({ title: err.message, icon: 'error', timer: 3000 });
    }
  };

  const onSubmit = async (data: Login) => {
    create(data)
      .unwrap()
      .then((res) => successCallbackHandler(res))
      .catch((err) => errorCallbackHandler(err));
  };

  return (
    <div className="flex justify-center items-center py-5 h-screen p-3">
      <div className="card bg-base-300 sm:max-w-1/2 lg:max-w-1/4 w-full">
        <div className="card-body">
          <h4 className="text-xl font-semibold text-center mb-3">
            Login Your Account
          </h4>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <Controller
                control={control}
                name="email"
                rules={{ required: 'Email is required' }}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <Input
                    type="email"
                    label="Email"
                    placeholder="Ex. john@gmail.com"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={fieldState.error?.message ? true : false}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password should be minimum 6 characters',
                  },
                }}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState,
                }) => (
                  <Input
                    type="password"
                    label="Password"
                    placeholder="Ex. ********"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={fieldState.error?.message ? true : false}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <Button
                type="submit"
                className="btn-primary"
                loading={result.isLoading}
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
