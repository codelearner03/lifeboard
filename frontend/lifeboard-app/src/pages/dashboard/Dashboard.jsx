import { useState, useEffect } from 'react';
import { Activity, Target, Repeat2, CheckSquare } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';
import Layout from '../../components/layout/Layout';
import StatCard from '../../components/ui/StatCard';
import InsightCard from '../../components/ui/InsightCard';
import api from '../../api/axios';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981'];

function Dashboard() {
  const name = localStorage.getItem('name');
  const [summary, setSummary]   = useState(null);
  const [insights, setInsights] = useState([]);
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, insightsRes, historyRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/insights'),
          api.get('/dashboard/score-history'),
        ]);
        setSummary(summaryRes.data);
        setInsights(insightsRes.data);
        setHistory(historyRes.data.map(h => ({
          date: h.date,
          score: parseFloat(h.score)
        })));
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  const pieData = summary ? [
    { name: 'Pending',     value: summary.taskDistribution.pending    },
    { name: 'In Progress', value: summary.taskDistribution.inProgress },
    { name: 'Completed',   value: summary.taskDistribution.completed  },
  ] : [];

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Good day, {name}! 👋
        </h1>
        <p className="text-gray-400 mt-1">Here's your life overview for today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Life Score"
          value={`${summary?.lifeScore ?? 0}`}
          subtitle="Today's score out of 100"
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Habits Today"
          value={`${summary?.completedHabitsToday ?? 0} / ${summary?.totalHabits ?? 0}`}
          subtitle="Completed today"
          icon={Repeat2}
          color="green"
        />
        <StatCard
          title="Pending Tasks"
          value={summary?.pendingTasks ?? 0}
          subtitle="Tasks waiting for you"
          icon={CheckSquare}
          color="amber"
        />
        <StatCard
          title="Active Goals"
          value={summary?.activeGoals ?? 0}
          subtitle="Goals in progress"
          icon={Target}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

        {/* Goals Progress */}
        <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-6">Goals Progress</h2>
          {summary?.goalProgress?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={summary.goalProgress} barSize={28}>
                <XAxis
                  dataKey="title"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(val) => [`${val}%`, 'Progress']}
                />
                <Bar dataKey="progress" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
              No active goals yet
            </div>
          )}
        </div>

        {/* Tasks Distribution */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-6">Tasks Distribution</h2>
          {pieData.some(d => d.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-gray-400 text-xs">{entry.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
              No tasks yet
            </div>
          )}
        </div>
      </div>

      {/* Score History + Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Score History */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-6">Life Score History</h2>
          {history.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
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
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
              No score history yet
            </div>
          )}
        </div>

        {/* Insights */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-6">Insights</h2>
          {insights.length > 0 ? (
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <InsightCard key={index} {...insight} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
              Start logging habits to get insights
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;