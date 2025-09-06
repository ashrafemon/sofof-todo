import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  useCreateTodoMutation,
  useFetchTodoQuery,
  useUpdateTodoMutation,
} from '../stores/actions/todos';
import {
  ApiErrorResponseInterface,
  ApiOkResponseInterface,
  ApiValidateErrorDataType,
  ResponseType,
} from '../types/base';
import { Todo } from '../types/todos';
import { alertMessage, validateError } from '../utils/helpers';
import Button from './ui/Button';
import Input from './ui/Input';
import LoadingSkeleton from './ui/LoadingSkeleton';
import Textarea from './ui/Textarea';

type IProps = {
  payload?: string | null | undefined;
  closer?: () => void;
};

const TodoForm = ({ payload, closer = () => {} }: IProps) => {
  const [createDoc, resultCreateDoc] = useCreateTodoMutation();
  const [updateDoc, resultUpdateDoc] = useUpdateTodoMutation();

  const { data, isFetching, isError, error } = useFetchTodoQuery(payload, {
    skip: !payload,
    refetchOnMountOrArgChange: true,
  });

  const { control, handleSubmit, setValue, setError } = useForm<Todo>({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const successCallbackHandler = (res: ApiOkResponseInterface) => {
    if (res.status === ResponseType.SUCCESS) {
      alertMessage({ title: res.message, icon: 'success', timer: 3000 });
      closer();
    }
  };

  const errorCallbackHandler = (err: ApiErrorResponseInterface) => {
    if (err.status === ResponseType.VALIDATE_ERROR) {
      const errors = validateError(err.data as ApiValidateErrorDataType);
      Object.keys(errors).forEach((fieldName) =>
        setError(fieldName as keyof Todo, {
          type: 'manual',
          message: errors[fieldName],
        }),
      );
    } else {
      alertMessage({ title: err.message, icon: 'error', timer: 3000 });
    }
  };

  const onSubmit = async (data: Todo) => {
    const fn = payload ? updateDoc : createDoc;
    const formData = { ...data, ...(payload && { id: payload }) };
    fn(formData)
      .unwrap()
      .then((res) => successCallbackHandler(res))
      .catch((err) => errorCallbackHandler(err));
  };

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      Object.keys(data).forEach((key) => {
        if (data[key] !== null) {
          setValue(key as keyof Todo, data[key]);
        }
      });
    }
  }, [data]);

  if (isFetching || isError) {
    return (
      <LoadingSkeleton isLoading={isFetching} isError={isError} error={error} />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-3">
        <Controller
          control={control}
          name="title"
          rules={{
            required: 'Title is required',
            minLength: {
              value: 3,
              message: 'Title should be minimum 3 characters',
            },
          }}
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <Input
              label="Title"
              placeholder="Ex. First Todo"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              error={fieldState.error?.message ? true : false}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <Textarea
              label="Description"
              placeholder="Ex. Todo description"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              error={fieldState.error?.message ? true : false}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <div className="flex flex-row gap-1">
          <Button
            type="submit"
            className="btn-primary"
            loading={resultCreateDoc.isLoading || resultUpdateDoc.isLoading}
          >
            {payload ? 'Update' : 'Save'}
          </Button>
          <Button
            className="btn-error"
            loading={resultCreateDoc.isLoading || resultUpdateDoc.isLoading}
            onClick={closer}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TodoForm;
