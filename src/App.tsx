import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import DebtPlanner from './pages/DebtPlanner';
import Budget from './pages/Budget';
import Savings from './pages/Savings';
import Chat from './pages/Chat';
import Challenges from './pages/Challenges';
import Education from './pages/Education';
import EducationModule from './pages/EducationModule';
import Profile from './pages/Profile';
import Organizations from './pages/Organizations';
import Transactions from './pages/Transactions';
import Login from './pages/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'debts', element: <DebtPlanner /> },
      { path: 'budget', element: <Budget /> },
      { path: 'savings', element: <Savings /> },
      { path: 'chat', element: <Chat /> },
      { path: 'challenges', element: <Challenges /> },
      { path: 'education', element: <Education /> },
      { path: 'education/:moduleId', element: <EducationModule /> },
      { path: 'profile', element: <Profile /> },
      { path: 'organizations', element: <Organizations /> },
      { path: 'transactions', element: <Transactions /> },
    ],
  },
  {
    path: '/auth',
    element: <Login />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
