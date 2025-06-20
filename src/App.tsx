import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import DebtPlanner from "./pages/DebtPlanner";
import Budget from "./pages/Budget";
import Chat from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";
import Savings from "./pages/Savings";
import Challenges from "./pages/Challenges";
import { Profile } from "./pages/Profile";
import Education from "./pages/Education";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "debts",
            element: <DebtPlanner />,
          },
          {
            path: "budget",
            element: <Budget />,
          },
          {
            path: "chat",
            element: <Chat />,
          },
          {
            path: "savings",
            element: <Savings />,
          },
          {
            path: "challenges",
            element: <Challenges />,
          },
          {
            path: "education",
            element: <Education />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <Login />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
