'use client';

import React from 'react';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onDelete }) => {
  return (
    <div className={`border rounded-lg p-4 mb-3 shadow-sm ${task.completed ? 'bg-green-50' : 'bg-white'}`}>
      <div className="flex items-start">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="mt-1 mr-3 h-5 w-5"
        />
        <div className="flex-1">
          <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
              {task.description}
            </p>
          )}
          <div className="mt-2 text-xs text-gray-500">
            Created: {new Date(task.created_at).toLocaleString()}
          </div>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="ml-4 text-red-500 hover:text-red-700"
          aria-label="Delete task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;