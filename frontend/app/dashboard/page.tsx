'use client';
import { authClient } from "@/lib/auth-client";
import { apiClient } from "@/lib/api";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, CheckCircle, Circle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAdding, setIsAdding] = useState(false);

 useEffect(() => {
  if (!isPending) {
    if (!session) {
      router.push('/login');
    } else {
      fetchTasks(); // Jab session mil jaye tab tasks load hon
    }
  }
 }, [session, isPending]);

  // useEffect(() => {
  // if (session) {
  //   fetchTasks();
  //  }
  // }, [session]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getTasks();
      setTasks(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const createdTask = await apiClient.createTask(newTask);
      setTasks([createdTask, ...tasks]);
      setNewTask({ title: '', description: '' });
      setIsAdding(false);
      toast.success('Task added successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add task');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = await apiClient.updateTask(task.id, { completed: !task.completed });
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      
      // Optimistic update
      toast.success(`Task marked as ${updatedTask.completed ? 'complete' : 'incomplete'}!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await apiClient.deleteTask(Number(taskId))
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete task');
    }
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      const updatedTask = await apiClient.updateTask(editingTask.id, {
        title: editingTask.title,
        description: editingTask.description
      });
      
      setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
      setEditingTask(null);
      toast.success('Task updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update task');
    }
  };

  const handleSignOut = async () => {
    try {
      await apiClient.signOut();
      router.push('/login');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              My Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-300">
              <p>Hi, {session?.user?.name || "User"}</p>
            </span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Add task form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                {isAdding ? 'Add New Task' : 'Quick Actions'}
              </h2>
              
              {isAdding ? (
                <form onSubmit={handleAddTask} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title *
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="What needs to be done?"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="Add details..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Add Task
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setIsAdding(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add New Task</span>
                  </button>
                  
                  <div className="pt-4">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Statistics</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-3 rounded-lg">
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {tasks.filter(t => !t.completed).length}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
                      </div>
                      <div className="bg-green-50/50 dark:bg-green-900/20 p-3 rounded-lg">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {tasks.filter(t => t.completed).length}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          
          {/* Right column - Task list */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Tasks</h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {tasks.filter(t => !t.completed).length} pending
                </div>
              </div>
              
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 dark:bg-gray-700/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No tasks yet</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Get started by adding a new task
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {tasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        layout
                        className={`p-4 rounded-xl border ${
                          task.completed
                            ? 'bg-green-50/30 dark:bg-green-900/10 border-green-200 dark:border-green-800/50'
                            : 'bg-white dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {editingTask?.id === task.id ? (
                          <form onSubmit={handleEditTask} className="space-y-3">
                            <input
                              type="text"
                              value={editingTask.title}
                              onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                              className="w-full px-3 py-2 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
                              autoFocus
                            />
                            <textarea
                              value={editingTask.description || ''}
                              onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                              className="w-full px-3 py-2 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                              rows={2}
                            />
                            <div className="flex space-x-2 pt-1">
                              <button
                                type="submit"
                                className="text-sm bg-indigo-600 text-white py-1 px-3 rounded-lg hover:opacity-90"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingTask(null)}
                                className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-1 px-3 rounded-lg hover:opacity-90"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="flex items-start">
                            <button
                              onClick={() => handleToggleComplete(task)}
                              className={`p-1 rounded-full mr-3 mt-1 ${
                                task.completed
                                  ? 'text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30'
                                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                              }`}
                              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                            >
                              {task.completed ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <Circle className="w-5 h-5" />
                              )}
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-medium truncate ${
                                task.completed
                                  ? 'text-green-700 dark:text-green-400 line-through'
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                  {task.description}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{/* task.created_at use karein aur check karein ke date valid hai */}
                                Created: {task.created_at ? new Date(task.created_at).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            
                            <div className="flex space-x-2 ml-2">
                              <button
                                onClick={() => setEditingTask(task)}
                                className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                aria-label="Edit task"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                aria-label="Delete task"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}