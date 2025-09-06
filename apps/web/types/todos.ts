export enum TodoStatus {
  PENDING,
  IN_PROGRESS,
  DONE,
}

export type Todo = {
  id: string | number;
  title: string;
  description?: string;
  status?: TodoStatus;
};
