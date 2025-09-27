import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const onLogout = () => {
    logout();
    nav("/login");
  };

  const hideLeaderboard = ["/login", "/register"].includes(location.pathname);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: logo */}
          {/* Left: logo */}
          <div className="flex items-center gap-4">
            <Link
              to={user?.role === "admin" ? "/admin" : "/"}
              className="flex items-center gap-2 font-extrabold text-2xl text-purple-600 hover:text-purple-800 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-3-3v6m8 2a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3 2-3h5a2 2 0 012 2v11z"
                />
              </svg>
              MHN Quizzy
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop links */}
          <div className="hidden sm:flex sm:items-center sm:gap-6">
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-sm text-gray-600 hover:text-gray-800 transition"
              >
                Admin
              </Link>
            )}
            {user?.role === "user" && (
              <Link
                to="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-800 transition"
              >
                Dashboard
              </Link>
            )}
            {user?.role === "user" && (
              <Link
                to="/my-votes"
                className="text-sm text-gray-600 hover:text-gray-800 transition"
              >
                My Votes
              </Link>
            )}

            {!hideLeaderboard && (
              <Link
                to="/leaderboard"
                className="text-sm text-gray-600 hover:text-gray-800 transition"
              >
                Leaderboard
              </Link>
            )}

            {user?.role === "user" && (
              <span className="text-sm text-gray-700">{user.name}</span>
            )}

            {user ? (
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 shadow-md text-white font-semibold text-sm rounded-lg transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm rounded-lg transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden px-4 pt-2 pb-4 space-y-2 bg-white shadow-md">
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="block text-gray-700 hover:text-gray-900 transition"
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </Link>
          )}
          {user?.role === "user" && (
            <Link
              to="/dashboard"
              className="block text-gray-700 hover:text-gray-900 transition"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {user?.role === "user" && (
            <Link
              to="/my-votes"
              className="block text-gray-700 hover:text-gray-900 transition"
              onClick={() => setMenuOpen(false)}
            >
              My Votes
            </Link>
          )}

          {!hideLeaderboard && (
            <Link
              to="/leaderboard"
              className="block text-gray-700 hover:text-gray-900 transition"
              onClick={() => setMenuOpen(false)}
            >
              Leaderboard
            </Link>
          )}

          {user ? (
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm rounded-lg transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-lg transition"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm rounded-lg transition"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
