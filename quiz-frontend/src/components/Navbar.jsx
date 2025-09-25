// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const onLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Left: logo & links */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
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
          BHN Quizzy
        </Link>

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
        <Link
          to="/leaderboard"
          className="text-sm text-gray-600 hover:text-gray-800 transition"
        >
          Leaderboard
        </Link>
      </div>

      {/* Right: auth buttons */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-700 hidden sm:block">{user.name}</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg text-white font-semibold text-sm rounded-lg transition transform hover:-translate-y-0.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 transition-transform group-hover:rotate-45"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7"
                />
              </svg>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="group flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg text-white font-semibold text-sm rounded-lg transition transform hover:-translate-y-0.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
              Login
            </Link>
            <Link
              to="/register"
              className="group flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg text-white font-semibold text-sm rounded-lg transition transform hover:-translate-y-0.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
