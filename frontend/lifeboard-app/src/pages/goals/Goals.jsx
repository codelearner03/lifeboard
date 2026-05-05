import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Target } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';

// ── Colores por categoría ─────────────────────────────────
const categoryColors = {
  personal: 'bg-purple-500/20 text-purple-400',
  health:   'bg-green-500/20 text-green-400',
  learning: 'bg-blue-500/20 text-blue-400',
  finance:  'bg-amber-500/20 text-amber-400',
  other:    'bg-gray-500/20 text-gray-400',
};

// ── Componente de la barra de progreso ────────────────────
function ProgressBar({ value }) {
  return (
    <div className="w-full bg-gray-800 rounded-full h-2 mt-3">
      <div
        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

// ── Modal de crear / editar ───────────────────────────────
function GoalModal({ goal, onClose, onSave }) {
  const [form, setForm] = useState({
    title:       goal?.title       ?? '',
    description: goal?.description ?? '',
    category:    goal?.category    ?? 'other',
    dueDate:     goal?.dueDate     ?? '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-white font-semibold text-lg mb-6">
          {goal ? 'Edit Goal' : 'New Goal'}
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
              placeholder="Learn React..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
              placeholder="What do you want to achieve?"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="personal">Personal</option>
              <option value="health">Health</option>
              <option value="learning">Learning</option>
              <option value="finance">Finance</option>
              <option value="other">Other</option>
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
              {goal ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Pantalla principal ────────────────────────────────────
function Goals() {
  const [goals, setGoals]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filter, setFilter]         = useState('all');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      setGoals(res.data);
    } catch (err) {
      console.error('Error loading goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (form) => {
    try {
      if (editingGoal) {
        await api.put(`/goals/${editingGoal.id}`, form);
      } else {
        await api.post('/goals', form);
      }
      await fetchGoals();
      setShowModal(false);
      setEditingGoal(null);
    } catch (err) {
      console.error('Error saving goal:', err);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal? Associated habits and tasks will be unlinked.')) return;
    try {
      await api.delete(`/goals/${id}`);
      setGoals(goals.filter(g => g.id !== id));
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  const handleNewGoal = () => {
    setEditingGoal(null);
    setShowModal(true);
  };

  const filteredGoals = goals.filter(g => filter === 'all' ? true : g.status === filter);

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Goals</h1>
          <p className="text-gray-400 mt-1">Track your long-term objectives</p>
        </div>
        <button
          onClick={handleNewGoal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New Goal
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {['all', 'active', 'completed', 'expired'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Lista de Goals */}
      {loading ? (
        <div className="text-gray-400 text-center py-20">Loading goals...</div>
      ) : filteredGoals.length === 0 ? (
        <div className="text-center py-20">
          <Target size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">No goals found. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredGoals.map(goal => (
            <div key={goal.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

              {/* Header de la tarjeta */}
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${categoryColors[goal.category]}`}>
                  {goal.category}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="p-1.5 text-gray-500 hover:text-blue-400 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Título y descripción */}
              <h3 className="text-white font-semibold text-lg">{goal.title}</h3>
              {goal.description && (
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{goal.description}</p>
              )}

              {/* Progreso */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span className="text-blue-400 font-medium">{goal.progress}%</span>
                </div>
                <ProgressBar value={goal.progress} />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                <span className={`text-xs px-2 py-1 rounded-md font-medium capitalize ${
                  goal.status === 'active'    ? 'bg-green-500/10 text-green-400' :
                  goal.status === 'completed' ? 'bg-blue-500/10 text-blue-400'  :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {goal.status}
                </span>
                {goal.dueDate && (
                  <span className="text-xs text-gray-500">
                    Due {new Date(goal.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <GoalModal
          goal={editingGoal}
          onClose={() => { setShowModal(false); setEditingGoal(null); }}
          onSave={handleSave}
        />
      )}
    </Layout>
  );
}

export default Goals;
