import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { RtkResponseErrorType } from '../../types/base';

const LoadingSkeleton = ({
  isLoading = true,
  isError = false,
  error,
}: {
  isLoading: boolean;
  isError?: boolean;
  error?: RtkResponseErrorType | undefined;
}) => {
  const statusCode = useMemo(() => {
    if (error && 'status' in error) {
      return error.status;
    }

    if (error && 'data' in error) {
      const { statusCode } = error.data as { statusCode: number };
      return statusCode;
    }

    return 400;
  }, [error]);

  const status = useMemo(() => {
    if (error && 'originalStatus' in error) {
      return error.originalStatus;
    }

    if (error && 'data' in error) {
      const { status } = error.data as { status: string };
      return status;
    }

    return 'ERROR';
  }, [error]);

  const message = useMemo(() => {
    if (error && 'error' in error) {
      return error.error;
    }

    if (error && 'data' in error) {
      const { message } = error.data as { message: string };
      return message;
    }

    return 'An unknown error occurred';
  }, [error]);

  if (isError) {
    return (
      <div className="flex flex-col gap-1 justify-center items-center p-3 w-full">
        <p className="text-6xl font-semibold text-error">{statusCode}</p>
        <p className="text-lg text-error">{status}</p>
        <p className="text-lg text-error">{message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1">
        <Skeleton count={5} />
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
