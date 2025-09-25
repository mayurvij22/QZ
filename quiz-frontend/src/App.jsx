import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext, lazy, Suspense } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx"; // <- Import toast provider
import Navbar from "./components/Navbar.jsx";

// Lazy-loaded pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));

// PrivateRoute with auth + role check
function PrivateRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return <div className="p-8 text-center text-gray-600">Checking authentication...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider> {/* Wrap with toast provider */}
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
          <Router>
            <Navbar />
            <main className="container mx-auto p-4">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route
                  path="/login"
                  element={
                    <Suspense fallback={<div className="p-8 text-center">Loading page...</div>}>
                      <Login />
                    </Suspense>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <Suspense fallback={<div className="p-8 text-center">Loading page...</div>}>
                      <Register />
                    </Suspense>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute role="admin">
                      <Suspense fallback={<div className="p-8 text-center">Loading page...</div>}>
                        <AdminDashboard />
                      </Suspense>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute role="user">
                      <Suspense fallback={<div className="p-8 text-center">Loading page...</div>}>
                        <UserDashboard />
                      </Suspense>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/leaderboard"
                  element={
                    <PrivateRoute>
                      <Suspense fallback={<div className="p-8 text-center">Loading page...</div>}>
                        <Leaderboard />
                      </Suspense>
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </Router>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
