import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Repeat2, Flame, Check } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';

// ── Colores por frecuencia ────────────────────────────────
const frequencyColors = {
  daily:  'bg-blue-500/20 text-blue-400',
  weekly: 'bg-purple-500/20 text-purple-400',
};

// ── Modal de crear / editar ───────────────────────────────
function HabitModal({ habit, goals, onClose, onSave }) {
  const [form, setForm] = useState({
    name:        habit?.name        ?? '',
    description: habit?.description ?? '',
    frequency:   habit?.frequency   ?? 'daily',
    icon:        habit?.icon        ?? 'star',
    goalId:      habit?.goalId      ?? '',
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

  const icons = ['star', 'dumbbell', 'book', 'code', 'droplet', 'wallet', 'globe', 'brain'];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-white font-semibold text-lg mb-6">
          {habit ? 'Edit Habit' : 'New Habit'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Morning Workout..."
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

          <div>
            <label className="block text-sm text-gray-400 mb-1">Frequency</label>
            <select
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
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

          <div>
            <label className="block text-sm text-gray-400 mb-2">Icon</label>
            <div className="flex gap-2 flex-wrap">
              {icons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setForm({ ...form, icon })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    form.icon === icon
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
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
              {habit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Pantalla principal ────────────────────────────────────
function Habits() {
  const [habits, setHabits]           = useState([]);
  const [goals, setGoals]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [habitsRes, goalsRes] = await Promise.all([
        api.get('/habits'),
        api.get('/goals'),
      ]);
      setHabits(habitsRes.data);
      setGoals(goalsRes.data);
    } catch (err) {
      console.error('Error loading habits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (form) => {
    try {
      if (editingHabit) {
        await api.put(`/habits/${editingHabit.id}`, form);
      } else {
        await api.post('/habits', form);
      }
      await fetchData();
      setShowModal(false);
      setEditingHabit(null);
    } catch (err) {
      console.error('Error saving habit:', err);
    }
  };

  const handleComplete = async (habit) => {
    if (habit.completedToday) return;
    try {
      await api.post(`/habits/${habit.id}/complete`);
      setHabits(habits.map(h =>
        h.id === habit.id
          ? { ...h, completedToday: true, streak: h.streak + 1 }
          : h
      ));
    } catch (err) {
      console.error('Error completing habit:', err);
    }
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this habit? All logs will be lost.')) return;
    try {
      await api.delete(`/habits/${id}`);
      setHabits(habits.filter(h => h.id !== id));
    } catch (err) {
      console.error('Error deleting habit:', err);
    }
  };

  const completedToday = habits.filter(h => h.completedToday).length;

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Habits</h1>
          <p className="text-gray-400 mt-1">
            {completedToday} of {habits.length} completed today
          </p>
        </div>
        <button
          onClick={() => { setEditingHabit(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New Habit
        </button>
      </div>

      {/* Progress bar del día */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Today's Progress</span>
          <span className="text-white font-medium">
            {habits.length > 0
              ? Math.round((completedToday / habits.length) * 100)
              : 0}%
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-700"
            style={{ width: `${habits.length > 0 ? (completedToday / habits.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Lista de Habits */}
      {loading ? (
        <div className="text-gray-400 text-center py-20">Loading habits...</div>
      ) : habits.length === 0 ? (
        <div className="text-center py-20">
          <Repeat2 size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">No habits yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {habits.map(habit => (
            <div
              key={habit.id}
              className={`bg-gray-900 border rounded-2xl p-6 transition-all ${
                habit.completedToday
                  ? 'border-green-500/40 bg-green-500/5'
                  : 'border-gray-800'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    habit.completedToday ? 'bg-green-500/20' : 'bg-gray-800'
                  }`}>
                    {habit.icon === 'dumbbell' ? '💪' :
                     habit.icon === 'book'     ? '📚' :
                     habit.icon === 'code'     ? '💻' :
                     habit.icon === 'droplet'  ? '💧' :
                     habit.icon === 'wallet'   ? '💰' :
                     habit.icon === 'globe'    ? '🌍' :
                     habit.icon === 'brain'    ? '🧠' : '⭐'}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{habit.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${frequencyColors[habit.frequency]}`}>
                      {habit.frequency}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(habit)} className="p-1.5 text-gray-500 hover:text-blue-400 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(habit.id)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Description */}
              {habit.description && (
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{habit.description}</p>
              )}

              {/* Goal asociada */}
              {habit.goalTitle && (
                <p className="text-xs text-blue-400 mb-4">🎯 {habit.goalTitle}</p>
              )}

              {/* Footer — Streak + Check button */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Flame size={14} />
                  <span className="text-sm font-medium">{habit.streak} day streak</span>
                </div>
                <button
                  onClick={() => handleComplete(habit)}
                  disabled={habit.completedToday}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    habit.completedToday
                      ? 'bg-green-500/20 text-green-400 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Check size={12} />
                  {habit.completedToday ? 'Done!' : 'Mark Done'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <HabitModal
          habit={editingHabit}
          goals={goals}
          onClose={() => { setShowModal(false); setEditingHabit(null); }}
          onSave={handleSave}
        />
      )}
    </Layout>
  );
}

export default Habits;