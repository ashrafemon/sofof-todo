'use client';

import {
  ControlledBoard,
  KanbanBoard,
  moveCard,
} from '@caldwell619/react-kanban';
import { useDisclosure } from '@reactuses/core';
import { useEffect, useState } from 'react';
import {
  useDeleteTodoMutation,
  useFetchTodosQuery,
  useUpdateTodoMutation,
} from '../stores/actions/todos';
import { Todo } from '../types/todos';
import { alertMessage, promptMessage } from '../utils/helpers';
import TodoForm from './TodoForm';
import Button from './ui/Button';
import Dialog from './ui/Dialog';
import LoadingSkeleton from './ui/LoadingSkeleton';

const TodoBoard = () => {
  const [board, setBoard] = useState<KanbanBoard<Todo>>({
    columns: [
      { id: 1, title: 'PENDING', cards: [] },
      { id: 2, title: 'IN_PROGRESS', cards: [] },
      { id: 3, title: 'DONE', cards: [] },
    ],
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, isError, error } =
    useFetchTodosQuery(`get_all=true`);

  const [deleteDoc, resultDeleteDoc] = useDeleteTodoMutation();
  const [updateDoc] = useUpdateTodoMutation();

  const deleteHandler = (id: string | number | null) => {
    if (!id) return;

    promptMessage(async () => {
      await deleteDoc(id.toString())
        .unwrap()
        .then((res) =>
          alertMessage({
            title: res.message,
            icon: 'success',
            timer: 2000,
          }),
        )
        .catch((err) =>
          alertMessage({
            title: err.message,
            icon: 'error',
            timer: 2000,
          }),
        );
    });
  };

  const updateHandler = async (
    id: string | number,
    body: { status: string },
  ) => {
    await updateDoc({ id, ...body })
      .unwrap()
      .catch((err) => {
        alertMessage({ title: err.message, icon: 'error' });
      });
  };

  useEffect(() => {
    if (data && data.length) {
      const groupByStatuses: Record<string, Todo[]> = data.reduce(
        (acc: Record<string, Todo[]>, item: Todo) => {
          const status = item.status ?? 'PENDING';
          if (!acc[status]) {
            acc[status] = [];
          }
          acc[status].push(item);
          return acc;
        },
        {} as Record<string, Todo[]>,
      );

      const statusList = ['PENDING', 'IN_PROGRESS', 'DONE'];
      const columnsWithData = statusList.map((status) => ({
        id: status,
        title: status,
        cards: groupByStatuses[status] ?? [],
      }));

      setBoard({ columns: columnsWithData });
    }
  }, [data]);

  if (isLoading || isError) {
    return (
      <LoadingSkeleton isLoading={isLoading} isError={isError} error={error} />
    );
  }

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} label="Update Todo">
        <TodoForm payload={selectedId} closer={onClose} />
      </Dialog>

      <ControlledBoard
        allowAddCard={false}
        renderColumnHeader={({ title }) => (
          <div className="border-b border-dotted border-black/10 mb-3">
            <h5 className="font-semibold text-lg text-center">{title}</h5>
          </div>
        )}
        renderCard={({ title, id }) => (
          <div className="card bg-base-300 max-w-60 w-full mb-3 block">
            <div className="card-body p-2 relative">
              <h5 className="text-sm line-clamp-2">{title}</h5>

              <div className="flex flex-row gap-1 absolute -top-2 -right-2">
                <Button
                  className="btn-square btn-warning btn-xs"
                  onClick={() => {
                    setSelectedId(id.toString());
                    onOpen();
                  }}
                  loading={resultDeleteDoc.isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M20.548 3.452a1.542 1.542 0 0 1 0 2.182l-7.636 7.636-3.273 1.091 1.091-3.273 7.636-7.636a1.542 1.542 0 0 1 2.182 0zM4 21h15a1 1 0 0 0 1-1v-8a1 1 0 0 0-2 0v7H5V6h7a1 1 0 0 0 0-2H4a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1z" />
                  </svg>
                </Button>
                <Button
                  className="btn-square btn-error btn-xs"
                  onClick={() => deleteHandler(id)}
                  loading={resultDeleteDoc.isLoading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="20"
                    height="20"
                    viewBox="0 0 50 50"
                  >
                    <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        )}
        onCardDragEnd={(card, source, destination) => {
          setBoard((currentBoard) =>
            moveCard(currentBoard, source, destination),
          );

          const productId = card.id;
          const { toColumnId: status } = destination as {
            toColumnId: string;
          };
          updateHandler(productId, { status });
        }}
      >
        {board}
      </ControlledBoard>
    </>
  );
};

export default TodoBoard;
