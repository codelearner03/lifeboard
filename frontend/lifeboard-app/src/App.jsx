import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Goals from './pages/goals/Goals';
import Habits from './pages/habits/Habits';
import Tasks from './pages/tasks/Tasks';
import Profile from './pages/profile/Profile';
import NotFound from './pages/NotFound';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
        <PrivateRoute><Dashboard /></PrivateRoute>
      } />
      <Route path="/goals" element={
        <PrivateRoute><Goals /></PrivateRoute>
      } />
      <Route path="/habits" element={
        <PrivateRoute><Habits /></PrivateRoute>
      } />
      <Route path="/tasks" element={
        <PrivateRoute><Tasks /></PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute><Profile /></PrivateRoute>
      } />
      <Route path="/404"   element={<NotFound />} />
      <Route path="*"      element={<Navigate to="/404" />} />
    </Routes>
  );}

export default App;
