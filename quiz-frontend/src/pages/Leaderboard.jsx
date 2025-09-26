import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Leaderboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/votes/leaderboard");
      setStats(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        Leaderboard
      </h1>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading leaderboard...</div>
      ) : stats.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No votes yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Total Quizzes
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Correct Answers
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Accuracy (%)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.map((user, index) => (
                <tr
                  key={user.email}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-sm">{user.total}</td>
                  <td className="px-4 py-3 text-sm">{user.correct}</td>
                  <td className="px-4 py-3 text-sm">
                    {(user.accuracy || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
