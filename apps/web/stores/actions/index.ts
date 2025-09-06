import auth from './auth';
import todos from './todos';

export const apiReducers = {
  [auth.reducerPath]: auth.reducer,
  [todos.reducerPath]: todos.reducer,
};

export const apiMiddleWares = [auth.middleware, todos.middleware];
