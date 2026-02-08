'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
      toast.error(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: { title: string; description?: string }) => {
    try {
      const newTask = await apiClient.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task created successfully!');
      return newTask;
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
      toast.error(err.message || 'Failed to create task');
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<{ title: string; description?: string; completed: boolean }>) => {
    try {
      const updatedTask = await apiClient.updateTask(id, updates);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      
      // Optimistic update handled in component
      toast.success('Task updated successfully!');
      return updatedTask;
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
      toast.error(err.message || 'Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await apiClient.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
      toast.error(err.message || 'Failed to delete task');
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}