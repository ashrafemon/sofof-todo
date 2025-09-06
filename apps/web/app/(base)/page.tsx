'use client';

import { useDisclosure } from '@reactuses/core';
import TodoBoard from '../../components/TodoBoard';
import TodoForm from '../../components/TodoForm';
import Dialog from '../../components/ui/Dialog';
import Button from '../../components/ui/Button';

const Page = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="container mx-auto py-5">
      <div className="card bg-base-300">
        <div className="card-body">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
            <h4 className="text-2xl font-semibold text-center">To-Do List</h4>
            <Button className="btn-primary" onClick={onOpen}>
              Add New
            </Button>
          </div>

          <Dialog open={isOpen} onClose={onClose} label="Add New Todo">
            <TodoForm closer={onClose} />
          </Dialog>

          {/* Board */}
          <TodoBoard />
        </div>
      </div>
    </div>
  );
};

export default Page;
