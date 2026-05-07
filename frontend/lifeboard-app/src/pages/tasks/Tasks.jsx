import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, CheckSquare, AlertCircle } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';

// ── Colores por prioridad ─────────────────────────────────
const priorityColors = {
  high:   'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  low:    'bg-green-500/20 text-green-400 border-green-500/30',
};

// ── Colores por estado ────────────────────────────────────
const statusColors = {
  pending:     'bg-gray-500/20 text-gray-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  completed:   'bg-green-500/20 text-green-400',
};

// ── Modal crear / editar ──────────────────────────────────
function TaskModal({ task, goals, onClose, onSave }) {
  const [form, setForm] = useState({
    title:       task?.title       ?? '',
    description: task?.description ?? '',
    priority:    task?.priority    ?? 'medium',
    dueDate:     task?.dueDate     ?? '',
    goalId:      task?.goalId      ?? '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({
      ...form,
      goalId: form.goalId === '' ? null : parseInt(form.goalId)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-white font-semibold text-lg mb-6">
          {task ? 'Edit Task' : 'New Task'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Build login screen..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Brief description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Associated Goal (optional)</label>
            <select
              name="goalId"
              value={form.goalId}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">No goal</option>
              {goals.map(g => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors text-sm"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Pantalla principal ────────────────────────────────────
function Tasks() {
  const [tasks, setTasks]           = useState([]);
  const [goals, setGoals]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter]     = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, goalsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/goals'),
      ]);
      setTasks(tasksRes.data);
      setGoals(goalsRes.data);
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (form) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, form);
      } else {
        await api.post('/tasks', form);
      }
      await fetchData();
      setShowModal(false);
      setEditingTask(null);
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await api.patch(`/tasks/${task.id}/status`, { status: newStatus });
      setTasks(tasks.map(t =>
        t.id === task.id ? { ...t, status: newStatus } : t
      ));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // Filtrado combinado
  const filteredTasks = tasks.filter(t => {
    const matchStatus   = statusFilter   === 'all' || t.status   === statusFilter;
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchStatus && matchPriority;
  });

  const statuses = ['pending', 'in_progress', 'completed'];

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Tasks</h1>
          <p className="text-gray-400 mt-1">
            {tasks.filter(t => t.status === 'completed').length} of {tasks.length} completed
          </p>
        </div>
        <button
          onClick={() => { setEditingTask(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Filtro por estado */}
        <div className="flex gap-2">
          {['all', 'pending', 'in_progress', 'completed'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Separador */}
        <div className="w-px bg-gray-700" />

        {/* Filtro por prioridad */}
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                priorityFilter === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Tasks */}
      {loading ? (
        <div className="text-gray-400 text-center py-20">Loading tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-20">
          <CheckSquare size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">No tasks found. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className={`bg-gray-900 border rounded-2xl p-5 transition-all ${
                task.status === 'completed'
                  ? 'border-green-500/20 opacity-75'
                  : task.isOverdue
                  ? 'border-red-500/30'
                  : 'border-gray-800'
              }`}
            >
              <div className="flex items-start gap-4">

                {/* Status selector circular */}
                <div className="flex flex-col gap-1 mt-0.5">
                  {statuses.map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(task, s)}
                      title={s.replace('_', ' ')}
                      className={`w-3 h-3 rounded-full border transition-all ${
                        task.status === s
                          ? s === 'pending'     ? 'bg-gray-400 border-gray-400'
                          : s === 'in_progress' ? 'bg-blue-400 border-blue-400'
                          :                       'bg-green-400 border-green-400'
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                    />
                  ))}
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`font-semibold ${
                        task.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'
                      }`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-gray-500 text-sm mt-0.5 line-clamp-1">{task.description}</p>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => handleEdit(task)} className="p-1.5 text-gray-500 hover:text-blue-400 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(task.id)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Meta + badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[task.status]}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    {task.goalTitle && (
                      <span className="text-xs text-blue-400">🎯 {task.goalTitle}</span>
                    )}
                    {task.dueDate && (
                      <span className={`text-xs flex items-center gap-1 ${task.isOverdue ? 'text-red-400' : 'text-gray-500'}`}>
                        {task.isOverdue && <AlertCircle size={11} />}
                        {task.isOverdue ? 'Overdue · ' : 'Due · '}
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <TaskModal
          task={editingTask}
          goals={goals}
          onClose={() => { setShowModal(false); setEditingTask(null); }}
          onSave={handleSave}
        />
      )}
    </Layout>
  );
}

export default Tasks;

