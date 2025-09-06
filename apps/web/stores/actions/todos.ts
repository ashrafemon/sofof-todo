import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '..';
import { API_URL } from '../../constants/urls';
import { jsonHeaders } from '../option';

const todos = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    headers: jsonHeaders,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token ?? null;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  keepUnusedDataFor: 5,
  refetchOnReconnect: true,
  tagTypes: ['Todos', 'Todo'],
  endpoints: (builder) => ({
    fetchTodos: builder.query({
      query: (params) => `todos?${params}`,
      transformResponse: (response: { data: any }) => response?.data,
      providesTags: ['Todos'],
    }),
    createTodo: builder.mutation({
      query: (data) => ({
        url: 'todos',
        method: 'POST',
        body: JSON.stringify(data),
      }),
      transformErrorResponse: (response) => response.data,
      invalidatesTags: ['Todos'],
    }),
    fetchTodo: builder.query({
      query: (id) => `todos/${id}`,
      transformResponse: (response: { data: any }) => response.data,
      providesTags: ['Todo'],
    }),
    updateTodo: builder.mutation({
      query: (data) => ({
        url: `todos/${data.id}`,
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
      transformErrorResponse: (response) => response.data,
      invalidatesTags: ['Todos'],
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `todos/${id}`,
        method: 'DELETE',
      }),
      transformErrorResponse: (response) => response.data,
      invalidatesTags: ['Todos'],
    }),
  }),
});

export const {
  useFetchTodosQuery,
  useCreateTodoMutation,
  useFetchTodoQuery,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todos;

export default todos;
