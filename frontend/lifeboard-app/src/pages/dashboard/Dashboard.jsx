import Layout from '../../components/layout/Layout';

function Dashboard() {
  const name = localStorage.getItem('name');

  return (
    <Layout>
      <div className="text-center mt-20">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome, {name}! 👋
        </h1>
        <p className="text-gray-400">Dashboard coming soon...</p>
      </div>
    </Layout>
  );
}

export default Dashboard;