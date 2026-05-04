function Dashboard() {
  const name = localStorage.getItem('name');

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome, {name}! 👋
        </h1>
        <p className="text-gray-400">Dashboard coming soon...</p>
      </div>
    </div>
  );
}

export default Dashboard;