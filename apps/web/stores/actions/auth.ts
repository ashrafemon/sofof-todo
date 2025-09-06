import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../constants/urls';
import { jsonHeaders } from '../option';

const auth = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    headers: jsonHeaders,
  }),
  keepUnusedDataFor: 5,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    createLogin: builder.mutation({
      query: (data) => ({
        url: 'auth/login',
        method: 'POST',
        body: JSON.stringify(data),
      }),
      transformErrorResponse: (response) => response.data,
    }),
  }),
});

export const { useCreateLoginMutation } = auth;

export default auth;
