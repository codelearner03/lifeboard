import { useState, useEffect } from 'react';
import { User, Lock, TrendingUp } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';

function Profile() {
  const [history, setHistory]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [message, setMessage]     = useState({ text: '', type: '' });

  const [profileForm, setProfileForm] = useState({
    name: localStorage.getItem('name') ?? '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/dashboard/score-history');
      setHistory(res.data.map(h => ({
        date:  h.date,
        score: parseFloat(h.score)
      })));
    } catch (err) {
      console.error('Error loading score history:', err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem('name', profileForm.name);
      showMessage('Profile updated successfully!');
    } catch (err) {
      showMessage('Error updating profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('Passwords do not match.', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showMessage('Password must be at least 6 characters.', 'error');
      return;
    }
    showMessage('Password updated successfully!');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const name  = localStorage.getItem('name');
  const email = localStorage.getItem('email') ?? '';

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 mt-1">Manage your account and view your progress</p>
      </div>

      {/* Mensaje de feedback */}
      {message.text && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${
          message.type === 'error'
            ? 'bg-red-500/10 border border-red-500/30 text-red-400'
            : 'bg-green-500/10 border border-green-500/30 text-green-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Columna izquierda */}
        <div className="space-y-6">

          {/* Avatar + info */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">{name}</h2>
                <p className="text-gray-400 text-sm">LifeBoard Member</p>
              </div>
            </div>

            {/* Editar nombre */}
            <div className="flex items-center gap-2 mb-4">
              <User size={16} className="text-blue-400" />
              <h3 className="text-white font-medium text-sm">Edit Profile</h3>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Full Name</label>
                <input
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Cambiar contraseña */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={16} className="text-blue-400" />
              <h3 className="text-white font-medium text-sm">Change Password</h3>
            </div>

            <form onSubmit={handlePasswordSave} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>

        {/* Columna derecha — Score History */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={16} className="text-blue-400" />
            <h3 className="text-white font-medium text-sm">Life Score History — Last 30 days</h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
              Loading history...
            </div>
          ) : history.length > 0 ? (
            <>
              {/* Score actual destacado */}
              <div className="text-center mb-6">
                <p className="text-5xl font-bold text-white">
                  {history[history.length - 1]?.score ?? 0}
                </p>
                <p className="text-gray-400 text-sm mt-1">Current Life Score</p>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(val) => [`${val}`, 'Score']}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
              No score history yet. Start logging habits!
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Profile;